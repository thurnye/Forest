import { UserRole } from "@/shared/types/api.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApiService } from "../../services/auth.api.service";

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email?: string; username?: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await authApiService.login(credentials); // returns LoginResponse
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
      return result; // returns LoginResponse | null
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Session expired');
    }
  }
);