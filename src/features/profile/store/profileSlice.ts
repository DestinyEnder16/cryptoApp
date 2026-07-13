import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/src/features/auth/types/auth';
import type { RootState } from '@/src/store';

interface ProfileState {
  user: User | null;
}

const initialState: ProfileState = {
  user: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = profileSlice.actions;

export const selectPersistedUser = (state: RootState) => state.profile.user;

export default profileSlice.reducer;
