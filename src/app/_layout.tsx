import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Colors } from '../constants/styles';
import { authenticateWithBiometrics } from '../services/biometricAuth';
import { store } from '../store';
import { cryptoApi } from '../store/api/Api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  logout,
  selectIsAuthenticated,
  setAuth,
  setToken,
} from '../store/slices/authSlice';

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

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const [failedBioMetricAuth, setFailedBiometricAuth] = useState<boolean>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(`Token: ${token}`);
        if (!token) return;

        dispatch(setToken(token));
        try {
          const user = await dispatch(
            cryptoApi.endpoints.fetchMe.initiate()
          ).unwrap();
          dispatch(setAuth({ user, token }));
          const response = await authenticateWithBiometrics();
          if (response === false) {
            setFailedBiometricAuth(true);
          } else {
            setFailedBiometricAuth(false);
          }
        } catch {
          await AsyncStorage.removeItem('token');
          dispatch(logout());
        }
      } finally {
        setReady(true);
      }
    }
    bootstrap();
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;
    router.replace(
      failedBioMetricAuth ? '/retryAuth' : isAuthed ? '/(tabs)/home' : '/'
    );
    // requestAnimationFrame(() =>
    //   requestAnimationFrame(() => SplashScreen.hideAsync()),
    // );
  }, [ready, isAuthed, failedBioMetricAuth]);

  if (!ready) return null;
  return <>{children}</>;
}
