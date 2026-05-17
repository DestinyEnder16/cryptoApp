import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

export async function completeLogout(dispatch: AppDispatch) {
  await AsyncStorage.removeItem('token');
  dispatch(logout());
  router.replace('/(auth)/auth');
}
