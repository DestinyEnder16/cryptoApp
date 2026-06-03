import { Colors } from '@/src/constants/styles';

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.primaryBackgroundColor,
        },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="success" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
