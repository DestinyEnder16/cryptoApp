import { AuthModeProvider } from '@/src/context/AuthModeContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthModeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </AuthModeProvider>
  );
}
