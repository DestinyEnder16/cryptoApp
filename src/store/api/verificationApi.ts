import type {
  AuthOtp,
  OtpRequest,
  OtpResponse,
  OtpVerificationPayload,
  OtpVerificationRequest,
  OtpVerificationResponse,
} from '@/src/types/auth/types';
import { baseApi } from './baseApi';

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    otp: build.mutation<AuthOtp, OtpRequest>({
      query: (body) => ({
        url: 'auth/otp/request',
        method: 'POST',
        body,
      }),
      transformResponse: (response: OtpResponse) => response.data,
    }),

    otpVerification: build.mutation<
      OtpVerificationPayload,
      OtpVerificationRequest
    >({
      query: (body) => ({
        url: 'auth/otp/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (response: OtpVerificationResponse) => response.data,
    }),
  }),
});

export const { useOtpMutation, useOtpVerificationMutation } = verificationApi;
