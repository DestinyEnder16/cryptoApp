import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Colors } from "../constants/styles";
import { isAuthError, signOut } from "../services/auth";
import { authenticateWithBiometrics } from "../services/biometricAuth";
import { getCredentials, getRefreshToken } from "../services/nativeKeychain";
import { getSignedOut } from "../services/sessionFlags";
import { persistor, store } from "../store";
import { profileApi } from "../store/api/profileApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setRefreshToken, setToken } from "../store/slices/authSlice";
import { NotificationProvider } from "../context/NotificationContext";
import { useEnsureDeviceRegistered } from "../hooks/useEnsureDeviceRegistered";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "NeueMontreal-Bold": require("@/assets/fonts/NeueMontreal-Bold.otf"),
    "NeueMontreal-Italic": require("@/assets/fonts/NeueMontreal-Italic.otf"),
    "NeueMontreal-Light": require("@/assets/fonts/NeueMontreal-Light.otf"),
    "NeueMontreal-Medium": require("@/assets/fonts/NeueMontreal-Medium.otf"),
    "NeueMontreal-Regular": require("@/assets/fonts/NeueMontreal-Regular.otf"),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <KeyboardProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <BottomSheetModalProvider>
                <AuthBootstrap>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: {
                        backgroundColor: Colors.primaryBackgroundColor,
                      },
                      animation: "slide_from_bottom",
                    }}
                  >
                    <Stack.Screen
                      name="(tabs)"
                      options={{ animation: "none" }}
                    />
                    <Stack.Screen
                      name="settings"
                      options={{ animation: "fade_from_bottom" }}
                    />
                  </Stack>
                </AuthBootstrap>
                <Toast />
              </BottomSheetModalProvider>
            </PersistGate>
          </Provider>
        </KeyboardProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}

type Route =
  "/" | "/onboarding" | "/(auth)/auth" | "/(auth)/welcome" | "/(tabs)/home";

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [target, setTarget] = useState<Route | null>(null);

  // Register this device's push token with the API whenever a session token is
  // present — covers both cold boot (token restored from Keychain) and fresh
  // login (token set by the sign-in flow). AuthBootstrap stays mounted for the
  // whole session, so this reacts to login without needing to re-bootstrap.
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);
  useEnsureDeviceRegistered(isAuthenticated);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<Route> {
      const credentials = await getCredentials();
      if (!credentials) return "/onboarding";

      // Token exists: hydrate Redux so /me carries the Bearer header.
      const token = credentials.password;
      dispatch(setToken(token));

      // Restore the refresh token too, so an expired access token can be
      // rotated transparently instead of forcing a re-login.
      const refreshToken = await getRefreshToken();
      if (refreshToken) dispatch(setRefreshToken(refreshToken));

      let me;
      try {
        // Validate the stored token and read the profile (we need the settings
        // to know whether biometric login is enabled). A 401/403 means the
        // session is dead.
        me = await dispatch(
          profileApi.endpoints.fetchMe.initiate(),
        ).unwrap();
      } catch (err) {
        if (isAuthError(err)) {
          // Token is dead — wipe Keychain, Redux, and persisted profile so
          // nothing reads a stale session before the redirect lands.
          await signOut(dispatch);
        } else {
          console.warn("fetchMe failed during bootstrap", err);
        }
        return "/(auth)/auth";
      }

      // The user explicitly signed out on this device (account still
      // remembered): send them to the welcome screen to re-verify ownership.
      if (await getSignedOut()) return "/(auth)/welcome";

      // Otherwise go straight home. If the user enabled biometric login, gate
      // the session behind a biometric prompt first; on failure fall back to
      // the welcome screen (password / biometric retry) rather than exposing
      // the account.
      if (me.settings?.biometricEnabled) {
        const passed = await authenticateWithBiometrics();
        if (!passed) return "/(auth)/welcome";
      }

      return "/(tabs)/home";
    }

    bootstrap()
      .catch((err) => {
        console.warn("bootstrap crashed", err);
        return "/(auth)/auth" as Route;
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
