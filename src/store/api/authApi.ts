import type {
  LoginPayload,
  LoginRequest,
  LoginResponse,
  LoginResult,
  RegisterPayload,
  RegisterRequest,
  RegisterResponse,
  TwoFactorDisablePayload,
  TwoFactorDisableRequest,
  TwoFactorDisableResponse,
  TwoFactorEnablePayload,
  TwoFactorEnableRequest,
  TwoFactorEnableResponse,
  TwoFactorSetupPayload,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
} from '@/src/types/auth/types';
import { baseApi } from './baseApi';
import { profileApi } from './profileApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResult, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: payload } = await queryFulfilled;
          // Only seed the fetchMe cache when the backend issued a full session.
          // 2FA challenges have no user yet — verifyTwoFactor will seed instead.
          if ('user' in payload) {
            dispatch(
              profileApi.util.upsertQueryData(
                'fetchMe',
                undefined,
                payload.user
              )
            );
          }
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

    enableTwoFactor: build.mutation<
      TwoFactorEnablePayload,
      TwoFactorEnableRequest
    >({
      query: (body) => ({
        url: 'auth/2fa/enable',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TwoFactorEnableResponse) => response.data,
      invalidatesTags: ['User'],
    }),

    disableTwoFactor: build.mutation<
      TwoFactorDisablePayload,
      TwoFactorDisableRequest
    >({
      query: (body) => ({
        url: 'auth/2fa/disable',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TwoFactorDisableResponse) => response.data,
      invalidatesTags: ['User'],
    }),

    verifyTwoFactor: build.mutation<LoginPayload, TwoFactorVerifyRequest>({
      query: (body) => ({
        url: 'auth/2fa/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TwoFactorVerifyResponse) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: payload } = await queryFulfilled;
          if (payload?.user) {
            dispatch(
              profileApi.util.upsertQueryData(
                'fetchMe',
                undefined,
                payload.user
              )
            );
          }
        } catch {
          // Verification failed — nothing to seed.
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useSetupTwoFactorMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
  useVerifyTwoFactorMutation,
} = authApi;
