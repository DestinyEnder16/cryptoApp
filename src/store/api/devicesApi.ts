import type {
  GetDevicesResponse,
  RegisterDeviceBody,
  RegisterDeviceResponse,
  RegisteredDevice,
} from '@/src/types/devices/types';
import { baseApi } from './baseApi';

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
