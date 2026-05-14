import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Colors } from "../constants/styles";
import { store } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "NeueMontreal-Bold": require("@/assets/fonts/NeueMontreal-Bold.otf"),
    "NeueMontreal-Italic": require("@/assets/fonts/NeueMontreal-Italic.otf"),
    "NeueMontreal-Light": require("@/assets/fonts/NeueMontreal-Light.otf"),
    "NeueMontreal-Medium": require("@/assets/fonts/NeueMontreal-Medium.otf"),
    "NeueMontreal-Regular": require("@/assets/fonts/NeueMontreal-Regular.otf"),
  });

  const [hasToken, setHasToken] = useState(false);

  useEffect(
    function () {
      async function getToken() {
        try {
          const value = await AsyncStorage.getItem("token");
          console.log(value);
          setHasToken(value !== null);
        } catch {
          console.log("No token set up");
        }
      }
      if (fontsLoaded || fontError) SplashScreen.hideAsync();
      getToken();
    },
    [fontsLoaded, fontError],
  );

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider store={store}>
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
        <Stack.Screen name="settings" options={{ animation: "none" }} />
      </Stack>
    </Provider>
  );
}
