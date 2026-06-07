import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

interface AuthState {
  token: string | null;
  username: string | null;
}

const initialState: AuthState = {
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = null;
      state.username = null;
    },
  },
});

export const { setUsername, logout, setToken } = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token;
export const selectUsername = (state: RootState) => state.auth.username;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.token !== null;

export default authSlice.reducer;
