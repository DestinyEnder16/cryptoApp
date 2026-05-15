import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "@/src/components/ScreenHeader";
import { Colors } from "@/src/constants/styles";

export default function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        animation: "none",
        header: () => (
          <View
            style={{
              paddingTop: insets.top + 10,
              backgroundColor: Colors.primaryBackgroundColor,
            }}
          >
            <ScreenHeader variant="profile" />
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
