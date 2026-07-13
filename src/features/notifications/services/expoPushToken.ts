import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type DevicePlatform = 'ios' | 'android' | 'web';

export function getDevicePlatform(): DevicePlatform {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

// Returns the Expo push token for the current device. On simulators / emulators
// `getExpoPushTokenAsync` throws ("Must use physical device for Push
// Notifications"), so in dev we fall back to a stable synthetic token keyed off
// the Expo session — enough to exercise the registration flow end-to-end
// without a physical device. In production we surface the real error so the
// caller can show the right message.
export async function getExpoPushToken(): Promise<string> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      if (__DEV__) return getDevFallbackToken();
      throw new Error('Notifications permission was denied.');
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const { data } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    return data;
  } catch (err) {
    if (__DEV__) return getDevFallbackToken();
    throw err;
  }
}

let cachedDevToken: string | null = null;
function getDevFallbackToken(): string {
  if (cachedDevToken) return cachedDevToken;
  const sessionId = Constants.sessionId ?? `local-${Date.now()}`;
  cachedDevToken = `ExponentPushToken[dev-${Platform.OS}-${sessionId}]`;
  return cachedDevToken;
}
