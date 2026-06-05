import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: 'none',
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="kycDone" />
      <Stack.Screen name="kycIncomplete" />
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
