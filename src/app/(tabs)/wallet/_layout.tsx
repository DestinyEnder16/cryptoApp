import { Stack } from "expo-router";

export default function WalletLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
      initialRouteName="main"
    >
      <Stack.Screen name="qrcode" />
      <Stack.Screen name="main" />
    </Stack>
  );
}
