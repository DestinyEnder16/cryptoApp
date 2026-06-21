import { createSlice } from '@reduxjs/toolkit';

const kycSlice = createSlice({
  name: 'kyc',
  initialState: {
    name: '',
    country: '',
    documentType: '',
    documentNumber: '',
  },
  reducers: {
    addDocumentType: (state, action) => {
      state.documentType = action.payload;
    },
    addName: (state, action) => {
      state.name = action.payload;
    },
    addCountry: (state, action) => {
      state.country = action.payload;
    },
    addDocumentNumber: (state, action) => {
      state.documentNumber = action.payload;
    },
  },
});

export const { addCountry, addDocumentNumber, addDocumentType, addName } =
  kycSlice.actions;
export default kycSlice.reducer;
