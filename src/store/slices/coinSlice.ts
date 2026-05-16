import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trendingCoins: [],
};

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    setTrendingCoins: (state, action) => {
      state.trendingCoins = action.payload;
    },
  },
});

export const { setTrendingCoins } = coinSlice.actions;
export default coinSlice.reducer;
