import type {
  LoginPayload,
  LoginRequest,
  LoginResponse,
  RegisterPayload,
  RegisterRequest,
  RegisterResponse,
} from '@/src/types/auth/types';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginPayload, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => response.data,
    }),

    signup: build.mutation<RegisterPayload, RegisterRequest>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: RegisterResponse) => response.data,
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
