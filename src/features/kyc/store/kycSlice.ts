import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  country: '',
  documentType: '',
  documentNumber: '',
  documentImageUrl: '',
  documentBackImageUrl: '',
  selfieImageUrl: '',
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
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
    addDocumentImageUrl: (state, action) => {
      state.documentImageUrl = action.payload;
    },
    addDocumentBackImageUrl: (state, action) => {
      state.documentBackImageUrl = action.payload;
    },
    addSelfieImageUrl: (state, action) => {
      state.selfieImageUrl = action.payload;
    },
    resetKyc: () => initialState,
  },
});

export const {
  addCountry,
  addDocumentNumber,
  addDocumentType,
  addName,
  addDocumentImageUrl,
  addDocumentBackImageUrl,
  addSelfieImageUrl,
  resetKyc,
} = kycSlice.actions;
export default kycSlice.reducer;
