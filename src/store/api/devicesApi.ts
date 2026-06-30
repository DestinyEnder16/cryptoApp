import type { DevicePlatform } from '@/src/services/expoPushToken';
import { saveDeviceId } from '@/src/services/nativeKeychain';
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

interface DeleteDeviceResponse {
  data: { deleted: boolean; deviceId: string };
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
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await saveDeviceId(data.id);
        } catch {
          // Registration failed — nothing to save.
        }
      },
    }),
    deleteDevice: build.mutation<DeleteDeviceResponse['data'], string>({
      query: (deviceId) => ({
        url: `/me/devices/${deviceId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: DeleteDeviceResponse) => response.data,
      invalidatesTags: ['Device'],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useRegisterDeviceMutation,
  useDeleteDeviceMutation,
} = devicesApi;
