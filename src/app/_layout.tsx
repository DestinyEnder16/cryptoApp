import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Colors } from '../constants/styles';
import { isAuthError, signOut } from '../services/auth';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '../services/biometricAuth';
import { getCredentials, getRefreshToken } from '../services/nativeKeychain';
import { persistor, store } from '../store';
import { profileApi } from '../store/api/profileApi';
import { useAppDispatch } from '../store/hooks';
import { setRefreshToken, setToken } from '../store/slices/authSlice';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
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
                <Stack.Screen
                  name="settings"
                  options={{ animation: 'fade_from_bottom' }}
                />
              </Stack>
            </AuthBootstrap>
            <Toast />
          </PersistGate>
        </Provider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

type Route =
  | '/'
  | '/onboarding'
  | '/(auth)/auth'
  | '/(auth)/welcome'
  | '/(tabs)/home';

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [target, setTarget] = useState<Route | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<Route> {
      const credentials = await getCredentials();
      if (!credentials) return '/onboarding';

      // Token exists: hydrate Redux so /me carries the Bearer header.
      const token = credentials.password;
      dispatch(setToken(token));

      // Restore the refresh token too, so an expired access token can be
      // rotated transparently instead of forcing a re-login.
      const refreshToken = await getRefreshToken();
      if (refreshToken) dispatch(setRefreshToken(refreshToken));

      let user;
      try {
        user = await dispatch(profileApi.endpoints.fetchMe.initiate()).unwrap();
      } catch (err) {
        if (isAuthError(err)) {
          // Token is dead — wipe Keychain, Redux, and persisted profile so
          // nothing reads a stale session before the redirect lands.
          await signOut(dispatch);
        } else {
          console.warn('fetchMe failed during bootstrap', err);
        }
        return '/(auth)/auth';
      }

      // Biometric gate: only prompt when the user opted in AND the device
      // actually has biometrics enrolled. Otherwise trust the validated /me.
      if (user.settings.biometricEnabled && (await isBiometricAvailable())) {
        const passed = await authenticateWithBiometrics();
        // Biometric failed/cancelled: hand off to /(auth)/welcome which has
        // a password fallback for this exact case.
        return passed ? '/(tabs)/home' : '/(auth)/welcome';
      }

      return '/(tabs)/home';
    }

    bootstrap()
      .catch((err) => {
        console.warn('bootstrap crashed', err);
        return '/(auth)/auth' as Route;
      })
      .then((result) => {
        if (!cancelled) setTarget(result);
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // Run navigation only AFTER target is set AND children have rendered
  // (effects fire post-commit, so <Stack> is mounted by the time this runs).
  useEffect(() => {
    if (!target) return;
    router.replace(target);
    SplashScreen.hideAsync();
  }, [target]);

  if (!target) return null;
  return <>{children}</>;
}
