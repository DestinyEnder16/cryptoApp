import { createSlice } from '@reduxjs/toolkit';

type UserState = {
  email: string;
  mobile: string;
  password: string;
};

const initialState: UserState = {
  email: '',
  mobile: '',
  password: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserEmail(state, action) {
      state.email = action.payload;
    },
    addUserPassword(state, action) {
      state.password = action.payload;
    },
    addUserMobile(state, action) {
      state.mobile = action.payload;
    },
  },
});

export const { addUserEmail, addUserMobile, addUserPassword } =
  userSlice.actions;
export default userSlice.reducer;
