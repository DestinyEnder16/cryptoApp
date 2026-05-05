import type {
  AuthOtp,
  AuthPayload,
  AuthResponse,
  LoginRequest,
  OtpRequest,
  OtpResponse,
  OtpVerificationPayload,
  OtpVerificationRequest,
  OtpVerificationResponse,
  RegisterRequest,
} from "@/src/types/auth/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  endpoints: (build) => ({
    login: build.mutation<AuthPayload, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    signup: build.mutation<AuthPayload, RegisterRequest>({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    otp: build.mutation<AuthOtp, OtpRequest>({
      query: (body) => ({
        url: "auth/otp/request",
        method: "POST",
        body,
      }),
      transformResponse: (response: OtpResponse) => response.data,
    }),

    otpVerification: build.mutation<
      OtpVerificationPayload,
      OtpVerificationRequest
    >({
      query: (body) => ({
        url: "auth/otp/verify",
        method: "POST",
        body,
      }),
      transformResponse: (response: OtpVerificationResponse) => response.data,
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useOtpMutation,
  useOtpVerificationMutation,
} = cryptoApi;
