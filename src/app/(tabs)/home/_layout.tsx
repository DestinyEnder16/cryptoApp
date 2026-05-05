import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        animationDuration: 1000,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="menu" />
    </Stack>
  );
}
