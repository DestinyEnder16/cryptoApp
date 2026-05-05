import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/*

{
  "data": {
    "user": {
      "id": "usr_student",
      "role": "customer",
      "fullName": "Ada Student",
      "email": "student@cryptoclass.test",
      "phone": "+2348010000001",
      "kycStatus": "approved",
      "avatarUrl": null,
      "watchlist": [
        "BTC",
        "ETH"
      ],
      "settings": {
        "language": "en",
        "fiatCurrency": "USD",
        "theme": "system",
        "priceAlerts": true,
        "pushNotifications": true,
        "biometricEnabled": false
      },
      "createdAt": "2026-05-03T14:00:00.000Z"
    },
    "token": "demo-user-token"
  }
}

*/

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    user: {
      id: string;
      role: string;
      fullName: string;
      email: string;
      phone: string;
      kycStatus: string;
      avatarUrl: string | null;
      watchlist: string[];
      settings: {
        language: string;
        fiatCurrency: string;
        theme: string;
        priceAlerts: boolean;
        pushNotifications: boolean;
        biometricEnabled: boolean;
      };
      createdAt: string;
    };
    token: string;
  };
}

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  endpoints: (build) => ({
    login: build.mutation<LoginResponse['data'], LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => response.data,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = cryptoApi;
