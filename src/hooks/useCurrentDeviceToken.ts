import { getExpoPushToken } from '@/src/services/expoPushToken';
import { useCallback, useEffect, useState } from 'react';

// Loads this device's Expo push token so callers can identify which entry in
// the registered-devices list (GET /me/devices) corresponds to this device.
export function useCurrentDeviceToken() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const t = await getExpoPushToken();
      setToken(t);
      return t;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not get this device’s push token.';
      setError(msg);
      return null;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { token, error, reload: load };
}
