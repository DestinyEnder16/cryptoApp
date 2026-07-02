import {
  getDevicePlatform,
  getExpoPushToken,
} from '@/src/services/expoPushToken';
import {
  useGetDevicesQuery,
  useRegisterDeviceMutation,
} from '@/src/store/api/devicesApi';
import { useEffect } from 'react';

/**
 * Once the user is authenticated, fetch this device's Expo push token and
 * register it with the API (POST /me/devices) so the backend can push
 * notifications to it. Foreground/tap listeners already live in
 * NotificationContext — this hook only handles the server registration wire.
 *
 * Skips the POST if this device's token is already registered — every
 * relogin on the same device would otherwise re-send the same token (the
 * backend is trusted to upsert, but there's no reason to make the redundant
 * call in the first place).
 *
 * Call it from inside the Redux Provider (it uses RTK Query hooks).
 */
export function usePushNotifications(isAuthenticated: boolean) {
  const { data: devicesData, isLoading: isLoadingDevices } =
    useGetDevicesQuery(undefined, { skip: !isAuthenticated });
  const [registerDevice] = useRegisterDeviceMutation();

  useEffect(() => {
    if (!isAuthenticated || isLoadingDevices) return;
    let cancelled = false;

    (async () => {
      try {
        const token = await getExpoPushToken();
        if (cancelled || !token) return;

        const alreadyRegistered = devicesData?.data.some(
          (d) => d.expoPushToken === token,
        );
        if (alreadyRegistered) return;

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
  }, [isAuthenticated, isLoadingDevices, devicesData, registerDevice]);
}
