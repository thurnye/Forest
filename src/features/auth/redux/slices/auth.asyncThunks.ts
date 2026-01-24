import { UserRole } from "@/shared/types/api.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApiService } from "../../services/auth.api.service";
import { studentApiService } from "@features/student/services/student.api.service";

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email?: string; username?: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApiService.login(credentials); // returns LoginResponse

      // Set studentId for student API calls if user is a student
      if (response.user?.role === 'STUDENT' && response.user?.id) {
        studentApiService.setStudentId(response.user.id);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: UserRole;
    },
    { rejectWithValue }
  ) => {
    try {
      return await authApiService.signup(data); // returns LoginResponse
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Signup failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authApiService.getCurrentUser(); // returns User
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to get user');
    }
  }
);

/**
 * Bootstrap auth on app load - attempts to restore session from refresh token
 */
export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApiService.bootstrapAuth();

      // Set studentId for student API calls if user is a student
      if (result?.user?.role === 'STUDENT' && result?.user?.id) {
        studentApiService.setStudentId(result.user.id);
      }

      return result; // returns LoginResponse | null
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Session expired');
    }
  }
);

/**
 * Logout - clears all tokens, cookies, and session data
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const userType = authApiService.getUserType();

      // Call the appropriate backend logout endpoint to clear cookies
      if (userType === 'student') {
        await authApiService.logoutStudent();
      } else if (userType === 'guardian') {
        await authApiService.logoutGuardian();
      } else {
        // Fallback: just clear local state
        await authApiService.logout();
      }

      // Clear student ID from student API service
      studentApiService.clearStudentId();

      return null;
    } catch (error: any) {
      // Even if backend fails, we still want to clear local state
      await authApiService.logout();
      // Clear student ID even on error
      studentApiService.clearStudentId();
      return rejectWithValue(error?.message || 'Logout failed');
    }
  }
);