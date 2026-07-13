import { getDevicePlatform } from '@/src/features/notifications/services/expoPushToken';
import {
  useGetDevicesQuery,
  useRegisterDeviceMutation,
} from '@/src/features/profile/store/devicesApi';
import { useEffect } from 'react';
import { useCurrentDeviceToken } from './useCurrentDeviceToken';

/**
 * Ensures this device's Expo push token is registered with the API
 * (POST /me/devices) — skips the call if it's already registered, so
 * relogging in on the same device doesn't re-send the same token.
 *
 * Used both silently (auth bootstrap, via `enabled`) and with visible
 * error/retry UI (the Devices settings screen), which is why token/devices
 * state and a manual `retry` are exposed rather than hidden inside the effect.
 */
export function useEnsureDeviceRegistered(enabled: boolean) {
  const {
    data: devicesData,
    isLoading: isLoadingDevices,
    refetch: refetchDevices,
  } = useGetDevicesQuery(undefined, { skip: !enabled });
  const [registerDevice, { isLoading: isRegistering, error: registerError }] =
    useRegisterDeviceMutation();
  const {
    token,
    error: tokenError,
    reload: reloadToken,
  } = useCurrentDeviceToken();

  const devices = devicesData?.data ?? [];
  const alreadyRegistered =
    !!token && devices.some((d) => d.expoPushToken === token);

  useEffect(() => {
    if (!enabled || !token || isLoadingDevices || isRegistering) return;
    if (alreadyRegistered) return;

    registerDevice({ expoPushToken: token, platform: getDevicePlatform() });
  }, [
    enabled,
    token,
    isLoadingDevices,
    isRegistering,
    alreadyRegistered,
    registerDevice,
  ]);

  async function retry() {
    const freshToken = await reloadToken();
    if (!freshToken) return;
    await refetchDevices();
    registerDevice({
      expoPushToken: freshToken,
      platform: getDevicePlatform(),
    });
  }

  return {
    devices,
    isLoadingDevices,
    token,
    tokenError,
    isRegistering,
    registerError,
    retry,
  };
}
