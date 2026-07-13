import type { DevicePlatform } from '@/src/features/notifications/services/expoPushToken';

export function platformTitle(platform: DevicePlatform): string {
  if (platform === 'ios') return 'iOS device';
  if (platform === 'android') return 'Android device';
  return 'Web browser';
}

export function platformShort(platform: DevicePlatform): string {
  if (platform === 'ios') return 'iOS';
  if (platform === 'android') return 'Android';
  return 'Web';
}
