/**
 * apiClient.service.ts
 * ReadingForest - secure-ish API client for MVP
 *
 * Includes fixes discussed:
 * ✅ Token storage: memory-only access token (best practice when refresh token is HttpOnly cookie)
 * ✅ Refresh URL slash fix
 * ✅ Proper refresh queue so multiple 401s don't spam refresh calls
 * ✅ Prevent refresh loops (/auth/refresh requests never trigger refresh)
 * ✅ Keeps bot detection headers + request-id + sanitization/redaction hooks
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { ApiClientError, ErrorCode, ApiResponse } from '../types/api.types';
import { sanitizeObject, redactSensitiveData } from '../utils/security.utils';
import { getBotDetectionHeaders } from '../utils/botDetection.utils';

// In development, use relative URL to go through Vite proxy (same-origin for cookies)
// In production, use the full API URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:8000/api');
const API_TIMEOUT = 30000;

/**
 * TokenManager — Access token in memory ONLY.
 * Best when your refresh token lives in a Secure + HttpOnly cookie.
 *
 * Tradeoff: access token is lost on full page refresh.
 * Solution: app can silently refresh on startup.
 */
class TokenManager {
  private static accessToken: string | null = null;

  static getAccessToken(): string | null {
    return this.accessToken;
  }

  static setAccessToken(token: string): void {
    this.accessToken = token;
  }

  static clear(): void {
    this.accessToken = null;
  }
}

/**
 * ApiClient — handles:
 * - Attaching access tokens
 * - Silent refresh using HttpOnly cookie
 * - Preventing refresh loops
 * - Refresh queue for multiple concurrent 401s
 */
class ApiClient {
  private client: AxiosInstance;

  // refresh coordination
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      withCredentials: true, // allows backend HttpOnly cookie to be sent
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(this.handleRequest.bind(this));
    this.client.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );
  }

  private async handleRequest(config: InternalAxiosRequestConfig) {
    const token = TokenManager.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // bot detection + traceability
    Object.assign(config.headers, getBotDetectionHeaders());
    config.headers['X-Request-ID'] = this.generateRequestId();

    // sanitize outbound body
    if (config.data) config.data = sanitizeObject(config.data);

    if (process.env.NODE_ENV === 'development') {
      // safe logging (no sensitive info)
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        data: redactSensitiveData(config.data || {}),
      });
    }

    return config;
  }

  private async handleResponse(response: AxiosResponse) {
    // If backend rotates access tokens, capture it here
    const newToken = response.headers['x-access-token'];
    if (newToken) TokenManager.setAccessToken(newToken);

    return response;
  }

  private subscribeTokenRefresh(cb: (token: string | null) => void) {
    this.refreshSubscribers.push(cb);
  }

  private notifyRefreshSubscribers(token: string | null) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  /**
   * Handle 401 errors by refreshing access token once and retrying.
   * - Never refresh for /auth/refresh calls (prevents loops)
   * - Queues concurrent 401 requests while refresh is in-flight
   */
  private async handleResponseError(error: AxiosError<ApiResponse<any>>) {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // no response => network error
    if (!error.response) {
      throw new ApiClientError('Network error', 0, ErrorCode.NETWORK_ERROR);
    }

    const status = error.response.status;

    // If we don't have the original request config, just throw
    if (!originalRequest) throw error;

    const reqUrl = originalRequest.url || '';
    // Check for any refresh endpoint (guardian, student, or generic)
    const isRefreshCall = reqUrl.includes('/refresh');

    // If refresh itself fails, clear token and fail hard
    if (isRefreshCall) {
      TokenManager.clear();
      throw new ApiClientError(
        'Unable to refresh session. Please log in again.',
        401,
        ErrorCode.AUTHENTICATION_ERROR
      );
    }

    // 401: attempt refresh once
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, wait for it then retry with returned token
      if (this.isRefreshing) {
        const token = await new Promise<string | null>((resolve) => {
          this.subscribeTokenRefresh(resolve);
        });

        if (token) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.client(originalRequest);
        }

        // refresh failed - don't redirect here, let the app handle it
        TokenManager.clear();
        throw new ApiClientError(
          'Session expired. Please log in again.',
          401,
          ErrorCode.AUTHENTICATION_ERROR
        );
      }

      // Start a refresh
      this.isRefreshing = true;

      try {
        const newToken = await this.refreshAccessToken();
        this.notifyRefreshSubscribers(newToken);

        if (newToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return this.client(originalRequest); // retry once
        }

        // no token returned => treat as expired - don't redirect, let app handle
        TokenManager.clear();
        throw new ApiClientError(
          'Session expired. Please log in again.',
          401,
          ErrorCode.AUTHENTICATION_ERROR
        );
      } catch (e) {
        // propagate refresh failure to queued subscribers
        this.notifyRefreshSubscribers(null);

        TokenManager.clear();
        throw new ApiClientError(
          'Session expired. Please log in again.',
          401,
          ErrorCode.AUTHENTICATION_ERROR
        );
      } finally {
        this.isRefreshing = false;
      }
    }

    // other errors: let caller handle
    throw error;
  }

  /**
   * Calls /auth/refresh to get a new access token using the HttpOnly cookie.
   * ✅ Slash fixed: `${API_BASE_URL}/auth/refresh`
   *
   * Backend should return new access token in `x-access-token` response header.
   */
  private async refreshAccessToken(): Promise<string | null> {
    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

    const newToken = res.headers['x-access-token'];
    if (newToken) TokenManager.setAccessToken(newToken);

    return newToken ?? null;
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Basic wrappers - return ApiResponse<T> for compatibility with service files
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return { success: false, data: null, message: error?.message || 'Request failed' };
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return { success: false, data: null, message: error?.message || 'Request failed' };
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return { success: false, data: null, message: error?.message || 'Request failed' };
    }
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return { success: false, data: null, message: error?.message || 'Request failed' };
    }
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return { success: false, data: null, message: error?.message || 'Request failed' };
    }
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export { TokenManager };
