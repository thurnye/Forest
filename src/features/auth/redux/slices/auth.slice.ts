import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@shared/types/api.types';
import { bootstrapAuth, getCurrentUser, login, signup } from './auth.asyncThunks';

interface AuthState {
  user: User | null;
  // token is optional; memory-only TokenManager is source of truth
  // token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasBootstrapped: boolean;
}

const initialState: AuthState = {
  user: null,
  // token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasBootstrapped: false,
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // call authApiService.logout() from UI/thunk if you want to hit backend too
      state.user = null;
      // state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // state.token = action.payload.token ?? null; // optional
        state.isAuthenticated = true;
        state.hasBootstrapped = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // state.token = action.payload.token ?? null; // optional
        state.isAuthenticated = true;
        state.hasBootstrapped = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Bootstrap auth (restore session on page refresh)
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasBootstrapped = true;
        if (action.payload) {
          state.user = action.payload.user;
          // state.token = action.payload.token ?? null;
          state.isAuthenticated = true;
        } else {
          // No previous session
          state.isAuthenticated = false;
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.isLoading = false;
        state.hasBootstrapped = true;
        state.isAuthenticated = false;
        state.user = null;
        // state.token = null;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
