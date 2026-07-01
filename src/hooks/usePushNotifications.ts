import {
  getDevicePlatform,
  getExpoPushToken,
} from '@/src/services/expoPushToken';
import { useRegisterDeviceMutation } from '@/src/store/api/devicesApi';
import { useEffect } from 'react';

/**
 * Once the user is authenticated, fetch this device's Expo push token and
 * register it with the API (POST /me/devices) so the backend can push
 * notifications to it. Foreground/tap listeners already live in
 * NotificationContext — this hook only handles the server registration wire.
 *
 * Call it from inside the Redux Provider (it uses an RTK Query mutation).
 */
export function usePushNotifications(isAuthenticated: boolean) {
  const [registerDevice] = useRegisterDeviceMutation();

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    (async () => {
      try {
        const token = await getExpoPushToken();
        if (cancelled || !token) return;

        await registerDevice({
          expoPushToken: token,
          platform: getDevicePlatform(),
        }).unwrap();

        console.log('✅ Push token registered on server:', token);
      } catch (err) {
        // Non-fatal: the user can still use the app without push registration.
        console.error('❌ Failed to register push token on server:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, registerDevice]);
}
