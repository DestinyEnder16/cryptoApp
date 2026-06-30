import { router } from 'expo-router';
import { clearDeviceId, getDeviceId, resetCredentials } from '../services/nativeKeychain';
import type { AppDispatch } from '../store';
import { baseApi } from '../store/api/baseApi';
import { devicesApi } from '../store/api/devicesApi';
import { logout } from '../store/slices/authSlice';

export async function completeLogout(dispatch: AppDispatch) {
  const deviceId = await getDeviceId();
  if (deviceId) {
    try {
      await dispatch(
        devicesApi.endpoints.deleteDevice.initiate(deviceId)
      ).unwrap();
    } catch {
      // Best-effort — token may already be expired or device already removed.
    }
  }

  await resetCredentials();
  await clearDeviceId();
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
  router.dismissAll();
  router.replace('/(auth)/auth');
}
