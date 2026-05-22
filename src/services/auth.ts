import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { AppDispatch } from '../store';
import { cryptoApi } from '../store/api/Api';
import { logout, setUser } from '../store/slices/authSlice';

export function isAuthError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const status = (err as FetchBaseQueryError).status;
  return status === 401 || status === 403;
}

export async function signOut(dispatch: AppDispatch): Promise<void> {
  await AsyncStorage.removeItem('token');
  dispatch(logout());
}

export type CompleteAuthResult = '/(tabs)/home' | '/(auth)/auth' | null;

export async function completeAuth(
  dispatch: AppDispatch,
  _token: string
): Promise<CompleteAuthResult> {
  try {
    const user = await dispatch(
      cryptoApi.endpoints.fetchMe.initiate()
    ).unwrap();
    dispatch(setUser(user));
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
