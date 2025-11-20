// store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // penting!
  isHydrated: false, // <--- kita tambah ini
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login Request
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // Login Success
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Login Failed
    loginFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Refresh Token Success
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    // Set User (untuk restore session)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // Update Access Token
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    // Logout
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = true;
      state.isHydrated = false; // pastikan di-set true saat logout
      state.error = null;
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    },

    setHydrated(state) {
      state.isHydrated = true;
      state.isLoading = false;
    },

    finishHydrate: (state) => {
      state.isHydrated = true;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailed,
  refreshTokenSuccess,
  setUser,
  setAccessToken,
  logout,
  clearError,
  finishHydrate,
  setHydrated,
} = authSlice.actions;

export default authSlice.reducer;
