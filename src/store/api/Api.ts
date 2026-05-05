import type {
  AuthPayload,
  AuthResponse,
  LoginRequest,
  OtpResponse,
  RegisterRequest,
} from '@/src/types/auth/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface OtpRequest {
  email: string;
}

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

    otp: build.mutation<OtpResponse['data'], OtpRequest>({
      query: (body) => ({
        url: 'auth/otp/request',
        method: 'POST',
        body,
      }),
      transformResponse: (response: OtpResponse) => response.data,
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useOtpMutation } =
  cryptoApi;
