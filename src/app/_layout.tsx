import { SplashScreen, Stack } from "expo-router";
import { useState } from "react";
import CustomSplash from "../components/CustomSplash";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return (
      <CustomSplash
        onLayout={() => SplashScreen.hideAsync()}
        onDone={() => setIsReady(true)}
      />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
