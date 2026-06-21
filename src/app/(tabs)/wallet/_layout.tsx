import { Stack } from 'expo-router';

export default function WalletLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* index redirects to main/locked based on KYC; no push animation. */}
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="main" options={{ animation: 'none' }} />
      <Stack.Screen name="locked" options={{ animation: 'none' }} />
      {/* portfolio, deposit/*, withdraw/*, transactions/* auto-register and
          inherit the slide animation from screenOptions above. */}
    </Stack>
  );
}
