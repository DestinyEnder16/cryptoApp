import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { persistor, type AppDispatch } from '@/src/store';
import { baseApi } from '@/src/store/baseApi';
import { devicesApi } from '@/src/features/profile/store/devicesApi';
import { profileApi } from '@/src/features/profile/store/profileApi';
import { logout } from '@/src/features/auth/store/authSlice';
import { clearUser } from '@/src/features/profile/store/profileSlice';
import { clearDeviceId, getDeviceId, resetCredentials } from './nativeKeychain';
import { setSignedOut } from './sessionFlags';

export function isAuthError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const status = (err as FetchBaseQueryError).status;
  return status === 401 || status === 403;
}

export async function signOut(dispatch: AppDispatch): Promise<void> {
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
  await setSignedOut(false);
  dispatch(logout());
  dispatch(clearUser());
  dispatch(baseApi.util.resetApiState());
  await persistor.purge();
}

export type CompleteAuthResult = '/(tabs)/home' | '/(auth)/auth' | null;

export async function completeAuth(
  dispatch: AppDispatch,
  _token: string
): Promise<CompleteAuthResult> {
  try {
    await dispatch(profileApi.endpoints.fetchMe.initiate()).unwrap();
    return '/(tabs)/home';
  } catch (err) {
    if (isAuthError(err)) {
      await signOut(dispatch);
      return '/(auth)/auth';
    }
    console.warn('completeAuth: non-auth error while fetching /me', err);
    return null;
  }
}
