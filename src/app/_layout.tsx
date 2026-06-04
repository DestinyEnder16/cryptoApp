import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { Colors } from '../constants/styles';
import { completeAuth, isAuthError, signOut } from '../services/auth';
import { getCredentials } from '../services/nativeKeychain';
import { store } from '../store';
import { profileApi } from '../store/api/profileApi';
import { settingsApi } from '../store/api/settingsApi';
import { useAppDispatch } from '../store/hooks';
import { setToken, setUser } from '../store/slices/authSlice';

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
          <Stack.Screen name="UserPreferenceSetting" />
        </Stack>
      </AuthBootstrap>
      <Toast />
    </Provider>
  );
}

type Route =
  | '/'
  | '/onboarding'
  | '/(auth)/auth'
  | '/(tabs)/home'
  | '/retryAuth'
  | '/userLogin'
  | '/welcome';

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);
  const targetRef = useRef<Route>('/');

  useEffect(() => {
    async function bootstrap() {
      let target: Route = '/';
      try {
        // check if a token exists
        const credentials = await getCredentials();

        // if no token, redirect to onboarding
        if (!credentials) {
          target = '/onboarding';
          return;
        }

        // token exists: proceed with authentication - add the token to the store
        const token = credentials.password;
        dispatch(setToken(token));

        let biometricRequired = false;
        try {
          // fetch the current user and store it
          const user = await dispatch(
            profileApi.endpoints.fetchMe.initiate()
          ).unwrap();
          dispatch(setUser(user));

          // get biometric requirement from user profile
          const settings = await dispatch(
            settingsApi.endpoints.fetchMySettings.initiate()
          ).unwrap();
          biometricRequired = settings.biometricEnabled;
        } catch (err) {
          if (isAuthError(err)) {
            console.warn('auth error');
            await signOut(dispatch);
            target = '/(auth)/auth';
            return;
          }
          // Transient/network failure: proceed without biometric gate
          // so the user isn't kicked out for a flaky connection.
          console.warn('fetchMySettings failed; skipping biometric gate', err);
        }

        if (biometricRequired) {
          target = '/welcome';
          return;
        }

        const next = await completeAuth(dispatch, token);
        // Fallback when /me fails for non-auth reasons: send to home and let
        // the destination surface its own error state. Don't use /retryAuth —
        // that screen is for biometric retries, not network errors.
        target = next ?? '/(tabs)/home';
      } finally {
        targetRef.current = target;
        setReady(true);
      }
    }
    bootstrap();
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;
    router.replace(targetRef.current);
    SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return <>{children}</>;
}
