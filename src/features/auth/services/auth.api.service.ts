import { TokenManager } from '@shared/services/apiClient.service';
import { apiClient } from '@shared/services/apiClient.service';
import { User, UserRole, Student, Parent, Teacher } from '@shared/types/api.types';

// Backend responses (your existing shapes)
export interface GuardianLoginResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  role: string; // 'PARENT' | 'TEACHER' (string from backend)
  accessToken: string;
}

export interface StudentLoginResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  readingLevel?: string;
  targetGradeLevel?: string;
  hasCompletedDiagnostic: boolean;
  diagnosticEnabled: boolean;
  guardianId?: string;
  accessToken: string;
}

export interface LoginResponse {
  user: User;
  token: string; // keep for UI convenience, but not persisted
}

export interface GuardianSignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  guardianName?: string;
}

export interface StudentSignupRequest {
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  targetGradeLevel?: string;
  diagnosticEnabled?: boolean;
  guardianId: string;
}

// User type storage key - stores 'student' or 'guardian' to know which refresh endpoint to use
const USER_TYPE_KEY = 'rf_user_type';

class AuthApiService {
  /**
   * Store user type for refresh endpoint selection
   */
  private setUserType(type: 'student' | 'guardian'): void {
    sessionStorage.setItem(USER_TYPE_KEY, type);
  }

  /**
   * Get stored user type
   */
  getUserType(): 'student' | 'guardian' | null {
    return sessionStorage.getItem(USER_TYPE_KEY) as 'student' | 'guardian' | null;
  }

  /**
   * Clear user type on logout
   */
  private clearUserType(): void {
    sessionStorage.removeItem(USER_TYPE_KEY);
  }

  /**
   * Login guardian (parent/teacher)
   */
  async loginGuardian(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const response = await apiClient.post<GuardianLoginResponse>(
      '/auth/guardian/login',
      credentials
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    const guardianData = response.data;

    // Store access token in memory and user type in sessionStorage
    if (guardianData.accessToken) {
      TokenManager.setAccessToken(guardianData.accessToken);
      this.setUserType('guardian');
    }

    const user: Parent | Teacher = {
      id: guardianData.id,
      email: guardianData.email,
      firstName: guardianData.firstName,
      lastName: guardianData.lastName,
      role:
        guardianData.role === 'TEACHER' ? UserRole.TEACHER : UserRole.PARENT,
      students: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user, token: guardianData.accessToken };
  }

  /**
   * Login student
   */
  async loginStudent(credentials: {
    username: string;
    password: string;
  }): Promise<LoginResponse> {
    const response = await apiClient.post<StudentLoginResponse>(
      '/auth/student/login',
      credentials
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    const studentData = response.data;

    // Store access token in memory and user type in sessionStorage
    if (studentData.accessToken) {
      TokenManager.setAccessToken(studentData.accessToken);
      this.setUserType('student');
      console.log('[Login] Student logged in, user type set to "student"');
    }

    const user: Student = {
      id: studentData.id,
      email: '', // students use username
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      username: studentData.username,
      role: UserRole.STUDENT,
      readingLevel: studentData.readingLevel as any,
      targetGradeLevel: studentData.targetGradeLevel as any,
      hasCompletedDiagnostic: studentData.hasCompletedDiagnostic,
      diagnosticEnabled: studentData.diagnosticEnabled,
      guardianId: studentData.guardianId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user, token: studentData.accessToken };
  }

  /**
   * Generic login
   */
  async login(credentials: {
    email?: string;
    username?: string;
    password: string;
  }): Promise<LoginResponse> {
    if (credentials.email) {
      return this.loginGuardian({
        email: credentials.email,
        password: credentials.password,
      });
    }
    if (credentials.username) {
      return this.loginStudent({
        username: credentials.username,
        password: credentials.password,
      });
    }
    throw new Error('Email or username is required');
  }

  /**
   * Register guardian
   */
  async signupGuardian(
    data: GuardianSignupRequest
  ): Promise<{ id: string; email: string }> {
    const response = await apiClient.post<{ id: string; email: string }>(
      '/auth/guardian/register',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed');
    }

    return response.data;
  }

  /**
   * Register student
   */
  async signupStudent(
    data: StudentSignupRequest
  ): Promise<{ id: string; username: string }> {
    const response = await apiClient.post<{ id: string; username: string }>(
      '/auth/student/register',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed');
    }

    return response.data;
  }

  /**
   * Logout (generic)
   * Clear client token + let backend clear cookies if endpoints exist
   */
  async logoutGuardian(): Promise<void> {
    try {
      await apiClient.post('/auth/guardian/logout');
    } finally {
      TokenManager.clear();
      this.clearUserType();
    }
  }

  async logoutStudent(): Promise<void> {
    try {
      await apiClient.post('/auth/student/logout');
    } finally {
      TokenManager.clear();
      this.clearUserType();
    }
  }

  async logout(): Promise<void> {
    TokenManager.clear();
    this.clearUserType();
  }

  /**
   * Refresh guardian session - returns user if successful
   */
  async refreshGuardian(): Promise<LoginResponse> {
    const response = await apiClient.post<GuardianLoginResponse>(
      '/auth/guardian/refresh'
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Refresh failed');
    }

    const guardianData = response.data;

    if (guardianData.accessToken) {
      TokenManager.setAccessToken(guardianData.accessToken);
    }

    const user: Parent | Teacher = {
      id: guardianData.id,
      email: guardianData.email,
      firstName: guardianData.firstName,
      lastName: guardianData.lastName,
      role:
        guardianData.role === 'TEACHER' ? UserRole.TEACHER : UserRole.PARENT,
      students: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user, token: guardianData.accessToken };
  }

  /**
   * Refresh student session - returns user if successful
   */
  async refreshStudent(): Promise<LoginResponse> {
    console.log('[RefreshStudent] Calling /auth/student/refresh...');
    const response = await apiClient.post<StudentLoginResponse>(
      '/auth/student/refresh'
    );
    console.log('[RefreshStudent] Response:', response);

    if (!response.success || !response.data) {
      console.error('[RefreshStudent] Failed:', response.message);
      throw new Error(response.message || 'Refresh failed');
    }

    const studentData = response.data;

    if (studentData.accessToken) {
      TokenManager.setAccessToken(studentData.accessToken);
    }

    const user: Student = {
      id: studentData.id,
      email: '',
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      username: studentData.username,
      role: UserRole.STUDENT,
      readingLevel: studentData.readingLevel as any,
      targetGradeLevel: studentData.targetGradeLevel as any,
      hasCompletedDiagnostic: studentData.hasCompletedDiagnostic,
      diagnosticEnabled: studentData.diagnosticEnabled,
      guardianId: studentData.guardianId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user, token: studentData.accessToken };
  }

  /**
   * Bootstrap auth - try to restore session on page refresh
   * Uses stored user type to call the correct refresh endpoint
   */
  async bootstrapAuth(): Promise<LoginResponse | null> {
    const userType = this.getUserType();
    console.log('[Bootstrap] User type from sessionStorage:', userType);

    if (!userType) {
      console.log('[Bootstrap] No user type found, skipping refresh');
      return null; // No previous session
    }

    try {
      console.log('[Bootstrap] Attempting refresh for:', userType);
      if (userType === 'guardian') {
        const result = await this.refreshGuardian();
        console.log('[Bootstrap] Guardian refresh successful:', result);
        return result;
      } else {
        const result = await this.refreshStudent();
        console.log('[Bootstrap] Student refresh successful:', result);
        return result;
      }
    } catch (error) {
      console.error('[Bootstrap] Refresh failed:', error);
      // Refresh failed - clear everything
      this.logout();
      return null;
    }
  }

  /**
   * Token presence check (in-memory)
   */
  verifyToken(): { valid: boolean } {
    return { valid: !!TokenManager.getAccessToken() };
  }

  isAuthenticated(): boolean {
    return !!TokenManager.getAccessToken();
  }

  getToken(): string | null {
    return TokenManager.getAccessToken();
  }

  /**
   * Signup + auto login (backward compatible)
   */
  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }): Promise<LoginResponse> {
    await this.signupGuardian({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    return this.loginGuardian({ email: data.email, password: data.password });
  }

  /**
   * Get current user (recommended approach)
   * Create a backend endpoint like GET /auth/me that returns the user.
   * This is better than "refresh just to get user info".
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get user');
    }

    return response.data;
  }
}

export const authApiService = new AuthApiService();
