import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  supportedAssets: [],
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    addSupportedMarkets(state, action) {
      state.supportedAssets = action.payload;
    },
  },
});

export const { addSupportedMarkets } = apiSlice.actions;
export default apiSlice.reducer;
