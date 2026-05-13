import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
    </Stack>
  );
}
