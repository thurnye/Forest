import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError, ApiResponse } from '@shared/types/api.types';
import { redactSensitiveData } from '@shared/utils/security.utils';

/**
 * Centralized Axios API client with interceptors
 */
class ApiClient {
  private client: AxiosInstance;
  private readonly TOKEN_KEY = 'rf_auth_token';

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Set up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - inject auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request (with sensitive data redacted)
        if (import.meta.env.DEV) {
          console.log('[API Request]', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data ? redactSensitiveData(config.data) : undefined,
          });
        }

        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - normalize errors
    this.client.interceptors.response.use(
      (response) => {
        // Log response in dev mode
        if (import.meta.env.DEV) {
          console.log('[API Response]', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }

        return response;
      },
      (error: AxiosError) => {
        const normalizedError = this.normalizeError(error);

        // Handle 401 - unauthorized
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        // Log error (with sensitive data redacted)
        console.error('[API Error]', {
          message: normalizedError.message,
          statusCode: normalizedError.statusCode,
          url: error.config?.url,
        });

        return Promise.reject(normalizedError);
      }
    );
  }

  /**
   * Normalize error responses
   */
  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      return {
        message: data?.message || data?.error || 'An error occurred',
        statusCode: error.response.status,
        errors: data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        statusCode: 0,
      };
    } else {
      // Error in request setup
      return {
        message: error.message || 'An unexpected error occurred',
        statusCode: 0,
      };
    }
  }

  /**
   * Store authentication token
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Retrieve authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Get the underlying axios instance for advanced usage
   */
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
