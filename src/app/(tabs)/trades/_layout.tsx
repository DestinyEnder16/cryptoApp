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
      <Stack.Screen name="buy" />
      <Stack.Screen name="sell" />
      <Stack.Screen name="locked" />
      <Stack.Screen name="main" />
    </Stack>
  );
}
