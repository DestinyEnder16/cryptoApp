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
  User,
  UserResponse,
} from "@/src/types/auth/types";
import type { AssetDetails, CoinData } from "@/src/types/coin/types";
import type {
  AssetDetailsResponse,
  SupportedAssetsResponse,
  TrendingAssetsResponse,
} from "@/src/types/market/types";
import type { NotificationResponse } from "@/src/types/notification/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/src/store";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    login: build.mutation<AuthPayload, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    fetchMe: build.query<User, void>({
      query: () => "/me",
      transformResponse: (response: UserResponse) => response.data,
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

    fetchSupportedAssets: build.query<string[], void>({
      query: () => "/market/assets",
      transformResponse: (response: SupportedAssetsResponse) =>
        response.data.map((asset) => asset.symbol),
      keepUnusedDataFor: 300,
    }),

    fetchAssetDetails: build.query<AssetDetails, string>({
      query: (arg) => `/market/assets/${arg}`,
      transformResponse: (response: AssetDetailsResponse): AssetDetails => ({
        ...response.data,
        chartData: response.data.chart.map((point) => ({
          timestamp: new Date(point.time).getTime(),
          value: point.priceUsd,
        })),
      }),
      keepUnusedDataFor: 60,
    }),

    fetchNotifications: build.query<NotificationResponse, void>({
      query: () => "/me/notifications",
    }),

    fetchTrendingAssets: build.query<CoinData[], void>({
      query: () => "/market/trending",
      transformResponse: (response: TrendingAssetsResponse) => response.data,
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useOtpMutation,
  useOtpVerificationMutation,
  useFetchSupportedAssetsQuery,
  useFetchAssetDetailsQuery,
  useFetchNotificationsQuery,
  useFetchTrendingAssetsQuery,
  useFetchMeQuery,
} = cryptoApi;
