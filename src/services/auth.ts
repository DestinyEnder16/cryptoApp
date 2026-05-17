import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { AppDispatch } from '../store';
import { cryptoApi } from '../store/api/Api';
import { logout, setAuth } from '../store/slices/authSlice';

function isAuthError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const status = (err as FetchBaseQueryError).status;
  return status === 401 || status === 403;
}

export type CompleteAuthResult = '/(tabs)/home' | '/(auth)/auth' | null;

export async function completeAuth(
  dispatch: AppDispatch,
  token: string
): Promise<CompleteAuthResult> {
  try {
    const user = await dispatch(
      cryptoApi.endpoints.fetchMe.initiate()
    ).unwrap();
    console.log(user);
    dispatch(setAuth({ user, token }));
    return '/(tabs)/home';
  } catch (err) {
    if (isAuthError(err)) {
      await AsyncStorage.removeItem('token');
      dispatch(logout());
      return '/(auth)/auth';
    }
    return null;
  }
}
