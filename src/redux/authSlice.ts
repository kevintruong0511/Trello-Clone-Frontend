import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../types/auth";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  initialized: boolean;
}

const initialState: AuthState = { accessToken: null, user: null, initialized: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser | null }>,
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user) state.user = action.payload.user;
      state.initialized = true;
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.initialized = true;
    },
  },
});

export const { setCredentials, setUser, setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
