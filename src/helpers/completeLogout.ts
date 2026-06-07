import { router } from 'expo-router';
import { resetCredentials } from '../services/nativeKeychain';
import type { AppDispatch } from '../store';
import { baseApi } from '../store/api/baseApi';
import { logout } from '../store/slices/authSlice';

export async function completeLogout(dispatch: AppDispatch) {
  await resetCredentials();
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
  router.dismissAll();
  router.replace('/(auth)/auth');
}
