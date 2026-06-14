import type { DevicePlatform } from '@/src/services/expoPushToken';

export interface RegisteredDevice {
  id: string;
  userId: string;
  expoPushToken: string;
  platform: DevicePlatform;
  createdAt: string;
  lastSeenAt: string;
}

export interface GetDevicesResponse {
  data: RegisteredDevice[];
  meta: { count: number; pushNotificationsEnabled: boolean };
}

export interface RegisterDeviceBody {
  expoPushToken: string;
  platform: DevicePlatform;
}

export interface RegisterDeviceResponse {
  data: RegisteredDevice;
}
