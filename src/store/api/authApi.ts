import type {
  LoginPayload,
  LoginRequest,
  LoginResponse,
  RegisterPayload,
  RegisterRequest,
  RegisterResponse,
  TwoFactorEnablePayload,
  TwoFactorEnableRequest,
  TwoFactorEnableResponse,
  TwoFactorSetupPayload,
  TwoFactorSetupResponse,
} from '@/src/types/auth/types';
import { baseApi } from './baseApi';
import { profileApi } from './profileApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginPayload, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: payload } = await queryFulfilled;
          dispatch(
            profileApi.util.upsertQueryData('fetchMe', undefined, payload.user)
          );
        } catch {
          // Login failed — nothing to seed.
        }
      },
    }),

    signup: build.mutation<RegisterPayload, RegisterRequest>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: RegisterResponse) => response.data,
    }),

    setupTwoFactor: build.mutation<TwoFactorSetupPayload, void>({
      query: () => ({
        url: 'auth/2fa/setup',
        method: 'POST',
      }),
      transformResponse: (response: TwoFactorSetupResponse) => response.data,
    }),

    enableTwoFactor: build.mutation<TwoFactorEnablePayload, TwoFactorEnableRequest>({
      query: (body) => ({
        url: 'auth/2fa/enable',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TwoFactorEnableResponse) => response.data,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useSetupTwoFactorMutation,
  useEnableTwoFactorMutation,
} = authApi;
