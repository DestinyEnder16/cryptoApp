import type {
  AuthPayload,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/src/types/auth/types';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
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
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
