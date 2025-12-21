import { apiClient } from '@shared/services/apiClient.service';
import { ApiResponse, User, UserRole, Student, Parent, Teacher } from '@shared/types/api.types';
import { mockUsers } from '@features/auth/mock/auth.mock';
import { diagnosticOverrides } from '@features/parent_teacher/services/parent_teacher.api.service';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Helper function to apply diagnostic overrides to user
function applyDiagnosticOverrides(user: Student | Parent | Teacher): User {
  if (user.role === UserRole.STUDENT) {
    const override = diagnosticOverrides.get(user.id);
    if (override) {
      return {
        ...user,
        diagnosticEnabled: override.diagnosticEnabled,
        hasCompletedDiagnostic: override.hasCompletedDiagnostic,
      } as Student;
    }
  }
  return user as User;
}

class AuthApiService {
  /**
   * Login user - using mock data
   */
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find((u) => u.email === credentials.email);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Apply diagnostic overrides
    const user = applyDiagnosticOverrides(foundUser as Student | Parent | Teacher);

    const token = `mock-jwt-token-${user.id}`;
    apiClient.setToken(token);

    return {
      success: true,
      data: { user, token },
    };
  }

  /**
   * Signup new user - using mock data
   */
  async signup(data: SignupRequest): Promise<ApiResponse<LoginResponse>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user based on role
    let newUser: User;
    if (data.role === UserRole.STUDENT) {
      newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        hasCompletedDiagnostic: false,
        diagnosticEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Student;
    } else if (data.role === UserRole.PARENT) {
      newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        students: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Parent;
    } else {
      newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        students: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Teacher;
    }

    mockUsers.push(newUser as any);

    const token = `mock-jwt-token-${newUser.id}`;
    apiClient.setToken(token);

    return {
      success: true,
      data: { user: newUser, token },
    };
  }

  /**
   * Get current authenticated user - using mock data
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const token = apiClient.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const userId = token.replace('mock-jwt-token-', '');
    const foundUser = mockUsers.find((u) => u.id === userId);

    if (!foundUser) {
      throw new Error('User not found');
    }

    // Apply diagnostic overrides
    const user = applyDiagnosticOverrides(foundUser as Student | Parent | Teacher);

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    apiClient.clearToken();
  }

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    const token = apiClient.getToken();
    return {
      success: true,
      data: { valid: !!token },
    };
  }
}

export const authApiService = new AuthApiService();
