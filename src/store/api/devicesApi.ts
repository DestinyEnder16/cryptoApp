import type { DevicePlatform } from '@/src/services/expoPushToken';
import { baseApi } from './baseApi';

export interface RegisteredDevice {
  id: string;
  userId: string;
  expoPushToken: string;
  platform: DevicePlatform;
  createdAt: string;
  lastSeenAt: string;
}

interface GetDevicesResponse {
  data: RegisteredDevice[];
  meta: { count: number; pushNotificationsEnabled: boolean };
}

interface RegisterDeviceBody {
  expoPushToken: string;
  platform: DevicePlatform;
}

interface RegisterDeviceResponse {
  data: RegisteredDevice;
}

export const devicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDevices: build.query<GetDevicesResponse, void>({
      query: () => '/me/devices',
      providesTags: ['Device'],
    }),
    registerDevice: build.mutation<RegisteredDevice, RegisterDeviceBody>({
      query: (body) => ({
        url: '/me/devices',
        method: 'POST',
        body,
      }),
      transformResponse: (response: RegisterDeviceResponse) => response.data,
      invalidatesTags: ['Device'],
    }),
  }),
});

export const { useGetDevicesQuery, useRegisterDeviceMutation } = devicesApi;
