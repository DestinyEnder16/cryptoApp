import { baseApi } from './baseApi';

// NOTE:
/*

{
  "data": [
    {
      "id": "device_abc123",
      "userId": "usr_student",
      "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
      "platform": "ios",
      "createdAt": "2026-05-03T14:30:00.000Z",
      "lastSeenAt": "2026-05-03T14:30:00.000Z"
    }
  ],
  "meta": {
    "count": 1,
    "pushNotificationsEnabled": true
  }
}

*/

interface GetDevicesPayload {
  id: string;
  userId: string;
  expoPushToken: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: string;
  lastSeenAt: string;
}

interface GetDevicesResponse {
  data: GetDevicesPayload;
  meta: { count: number; pushNotificationsEnabled: boolean };
}

export const devicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDevices: build.query<GetDevicesPayload, void>({
      query: () => '/me/devices',
      transformResponse: (response: GetDevicesResponse) => response.data,
    }),
  }),
});

export const { useGetDevicesQuery } = devicesApi;
