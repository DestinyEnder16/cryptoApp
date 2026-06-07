import type { AuthPayload, SettingDetails, User } from '@/src/types/auth/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

interface AuthState {
  user: User | null;
  token: string | null;
  username: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setSettings(state, action: PayloadAction<SettingDetails>) {
      if (state.user) {
        state.user.settings = action.payload;
      }
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.username = null;
    },
  },
});

export const { setAuth, setUser, setSettings, setUsername, logout, setToken } =
  authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectUsername = (state: RootState) => state.auth.username;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.token !== null;

export const selectKycStatus = (state: RootState) => state.auth.user?.kycStatus;
export const selectIsKycApproved = (state: RootState) =>
  state.auth.user?.kycStatus === 'approved';
export const selectVerification = (state: RootState) =>
  state.auth.user?.verification;
export const selectVerificationLevel = (state: RootState) =>
  state.auth.user?.verification.level ?? 0;
export const selectCanTrade = (state: RootState) =>
  state.auth.user?.verification.canTrade ?? false;
export const selectCanWithdraw = (state: RootState) =>
  state.auth.user?.verification.canWithdraw ?? false;

export default authSlice.reducer;
