import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { Colors } from "../constants/styles";
import { completeAuth, isAuthError, signOut } from "../services/auth";
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from "../services/biometricAuth";
import { store } from "../store";
import { cryptoApi } from "../store/api/Api";
import { useAppDispatch } from "../store/hooks";
import { setToken } from "../store/slices/authSlice";
import Toast from "react-native-toast-message";

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
    <Provider store={store}>
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
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
          <Stack.Screen name="profile" options={{ animation: "none" }} />
          <Stack.Screen
            name="settings"
            options={{ animation: "fade_from_bottom" }}
          />
          <Stack.Screen
            name="retryAuth"
            options={{ animation: "fade_from_bottom" }}
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
  | "/"
  | "/onboarding"
  | "/(auth)/auth"
  | "/(tabs)/home"
  | "/retryAuth"
  | "/userLogin";

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);
  const targetRef = useRef<Route>("/");

  useEffect(() => {
    async function bootstrap() {
      let target: Route = "/";
      try {
        // check if a token exists
        const token = await AsyncStorage.getItem("token");

        // if no token, redirect to onboarding
        if (!token) {
          target = "/onboarding";
          return;
        }

        // token exists: proceed with authentication - add the token to the store
        dispatch(setToken(token));

        let biometricRequired = false;
        try {
          // get biometric requirement from user profile
          const settings = await dispatch(
            cryptoApi.endpoints.fetchMySettings.initiate(),
          ).unwrap();
          biometricRequired = settings.biometricEnabled;
        } catch (err) {
          if (isAuthError(err)) {
            console.warn("auth error");
            await signOut(dispatch);
            target = "/(auth)/auth";
            return;
          }
          // Transient/network failure: proceed without biometric gate
          // so the user isn't kicked out for a flaky connection.
          console.warn("fetchMySettings failed; skipping biometric gate", err);
        }

        if (biometricRequired) {
          const biometricAvailable = await isBiometricAvailable();
          if (!biometricAvailable) {
            await signOut(dispatch);
            target = "/userLogin";
            return;
          }
          const ok = await authenticateWithBiometrics();
          if (!ok) {
            target = "/retryAuth";
            return;
          }
        }

        const next = await completeAuth(dispatch, token);
        // Fallback when /me fails for non-auth reasons: send to home and let
        // the destination surface its own error state. Don't use /retryAuth —
        // that screen is for biometric retries, not network errors.
        target = next ?? "/(tabs)/home";
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
