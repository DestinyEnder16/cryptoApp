import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { AppDispatch } from '../store';
import { baseApi } from '../store/api/baseApi';
import { profileApi } from '../store/api/profileApi';
import { logout } from '../store/slices/authSlice';
import { resetCredentials } from './nativeKeychain';

export function isAuthError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const status = (err as FetchBaseQueryError).status;
  return status === 401 || status === 403;
}

export async function signOut(dispatch: AppDispatch): Promise<void> {
  await resetCredentials();
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
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
