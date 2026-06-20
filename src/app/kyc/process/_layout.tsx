import { Stack } from 'expo-router';

export default function ProcessLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="identity" />
      <Stack.Screen name="document" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
