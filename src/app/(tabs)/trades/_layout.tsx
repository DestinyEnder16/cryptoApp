import { Stack } from 'expo-router';

export default function TradesLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="main" />
      <Stack.Screen name="buy" />
      <Stack.Screen name="sell" />
      <Stack.Screen name="swap" />
      <Stack.Screen name="quote" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="result" />
      <Stack.Screen name="locked" />
    </Stack>
  );
}
