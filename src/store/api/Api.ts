import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AuthPayload,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/src/types/auth/types';

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  endpoints: (build) => ({
    login: build.mutation<AuthPayload, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    signup: build.mutation<AuthPayload, RegisterRequest>({
      query: (credentials) => ({
        url: 'auth/signup',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = cryptoApi;
