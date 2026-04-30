import { Colors } from '@/src/constants/styles';
import { AuthModeProvider } from '@/src/context/AuthModeContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthModeProvider>
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
      </Stack>
    </AuthModeProvider>
  );
}
