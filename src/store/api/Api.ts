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

type CheckAssets = {
  id: string;
  symbol: string;
  name: string;
  network: string;
  priceUsd: number;
  change24h: number;
  isActive: boolean;
  minBuyUsd: number;
  minSellUsd: number;
  iconUrl: string;
};

type CheckAssetsResponse = {
  data: CheckAssets[];
};

type ChartPoint = {
  time: string;
  priceUsd: number;
};

type AssetDetails = CheckAssets & {
  chart: ChartPoint[];
};

type AssetDetailsResponse = {
  data: AssetDetails;
};

type TrendingAssetResponse = {
  data: CheckAssets[];
};

type NotificationDetails = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationResponse = {
  data: NotificationDetails;
  meta: {
    count: number;
  };
};

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

    fetchSupportedAssets: build.query<string[], void>({
      query: () => "/market/assets",
      transformResponse: (response: CheckAssetsResponse) =>
        response.data.map((asset) => asset.symbol),
    }),

    fetchAssetDetails: build.query<AssetDetails, string>({
      query: (arg) => `/market/assets/${arg}`,
      transformResponse: (response: AssetDetailsResponse) => response.data,
    }),

    fetchNotifications: build.query<NotificationResponse, void>({
      query: () => "/me/notifications",
    }),

    fetchTrendingAssets: build.query<CheckAssets[], void>({
      query: () => "/market/trending",
      transformResponse: (response: TrendingAssetResponse) => response.data,
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
} = cryptoApi;
