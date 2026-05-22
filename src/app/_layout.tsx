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
          <Stack.Screen name="userLogin" />
          <Stack.Screen name="userPreferenceSetting" />
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
  | '/retryAuth'
  | '/userLogin';

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState<Route>('/');

  useEffect(() => {
    async function bootstrap() {
      try {
        // IMPORTANT: Checks if there is a token stored in the device
        const token = await AsyncStorage.getItem('token');

        // NOTE: If no token, show the onboarding screen
        if (!token) {
          setRedirectTo('/onboarding');
          return;
        }

        // move the token from async storage to redux store
        dispatch(setToken(token));

        // IMPORTANT: Checking if the user in question needs biometrics to login
        let biometricRequired: boolean;
        try {
          const settings = await dispatch(
            cryptoApi.endpoints.fetchMySettings.initiate()
          ).unwrap();
          biometricRequired = settings.biometricEnabled;
        } catch {
          await AsyncStorage.removeItem('token');
          setRedirectTo('/(auth)/auth');
          return;
        }

        // IMPORTANT: Checks if the user has saved means of authentication
        const biometricAvailable = await isBiometricAvailable();

        if (biometricRequired && !biometricAvailable) {
          await AsyncStorage.removeItem('token');
          dispatch(logout());
          setRedirectTo('/userLogin');
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
