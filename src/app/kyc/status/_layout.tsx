import { Stack } from 'expo-router';

export default function StatusLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pending" />
      <Stack.Screen name="approved" />
      <Stack.Screen name="rejected" />
    </Stack>
  );
}
