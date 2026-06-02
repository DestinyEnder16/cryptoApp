import type {
  SettingDetails,
  SettingsResponse,
} from '@/src/types/auth/types';
import { baseApi } from './baseApi';

type SettingsRequest = {
  language: string;
  fiatCurrency: string;
  theme: string;
  priceAlerts: boolean;
  pushNotifications: boolean;
  biometricEnabled: boolean;
};

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    editSettings: build.mutation<SettingDetails, SettingsRequest>({
      query: (settings) => ({
        url: '/me/settings',
        method: 'PATCH',
        body: settings,
      }),
      transformResponse: (response: SettingsResponse) => response.data,
    }),

    fetchMySettings: build.query<SettingDetails, void>({
      query: () => '/me/settings',
      transformResponse: (response: SettingsResponse) => response.data,
    }),
  }),
});

export const { useEditSettingsMutation, useFetchMySettingsQuery } = settingsApi;
