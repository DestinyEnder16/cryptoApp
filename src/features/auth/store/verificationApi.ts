import type {
  AuthOtp,
  OtpRequest,
  OtpResponse,
  OtpVerificationPayload,
  OtpVerificationRequest,
  OtpVerificationResponse,
  ValidationDetails,
  ValidationRequest,
  ValidationResponse,
} from '@/src/features/auth/types/auth';
import { baseApi } from '@/src/store/baseApi';

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

    validateSignUpDetails: build.mutation<ValidationDetails, ValidationRequest>(
      {
        query: (body) => ({
          url: 'auth/validate-signup',
          method: 'POST',
          body,
        }),
        transformResponse: (response: ValidationResponse) => response.data,
      }
    ),
  }),
});

export const {
  useOtpMutation,
  useOtpVerificationMutation,
  useValidateSignUpDetailsMutation,
} = verificationApi;
