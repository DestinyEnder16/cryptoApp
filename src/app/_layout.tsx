import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Colors } from '../constants/styles';
import { completeAuth } from '../services/auth';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '../services/biometricAuth';
import { store } from '../store';
import { cryptoApi } from '../store/api/Api';
import { useAppDispatch } from '../store/hooks';
import { logout, setToken } from '../store/slices/authSlice';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'NeueMontreal-Bold': require('@/assets/fonts/NeueMontreal-Bold.otf'),
    'NeueMontreal-Italic': require('@/assets/fonts/NeueMontreal-Italic.otf'),
    'NeueMontreal-Light': require('@/assets/fonts/NeueMontreal-Light.otf'),
    'NeueMontreal-Medium': require('@/assets/fonts/NeueMontreal-Medium.otf'),
    'NeueMontreal-Regular': require('@/assets/fonts/NeueMontreal-Regular.otf'),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider store={store}>
      <AuthBootstrap>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.primaryBackgroundColor,
            },
            animation: 'slide_from_bottom',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
          <Stack.Screen name="profile" options={{ animation: 'none' }} />
          <Stack.Screen
            name="settings"
            options={{ animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="retryAuth"
            options={{ animation: 'fade_from_bottom' }}
          />
        </Stack>
      </AuthBootstrap>
    </Provider>
  );
}

type Route =
  | '/'
  | '/onboarding'
  | '/(auth)/auth'
  | '/(tabs)/home'
  | '/retryAuth';

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState<Route>('/');

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setRedirectTo('/onboarding');
          return;
        }
        dispatch(setToken(token));

        let biometricRequired: boolean;
        try {
          const settings = await dispatch(
            cryptoApi.endpoints.fetchMySettings.initiate()
          ).unwrap();
          biometricRequired = settings.biometricEnabled;
        } catch {
          setRedirectTo('/(auth)/auth');
          return;
        }

        const biometricAvailable = await isBiometricAvailable();

        if (biometricRequired && !biometricAvailable) {
          await AsyncStorage.removeItem('token');
          dispatch(logout());
          setRedirectTo('/(auth)/auth');
          return;
        }

        if (biometricRequired) {
          const ok = await authenticateWithBiometrics();
          if (!ok) {
            setRedirectTo('/retryAuth');
            return;
          }
        }

        const next = await completeAuth(dispatch, token);
        setRedirectTo(next ?? '/retryAuth');
      } finally {
        setReady(true);
      }
    }
    bootstrap();
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;
    router.replace(redirectTo);
  }, [ready, redirectTo]);

  if (!ready) return null;
  return <>{children}</>;
}
