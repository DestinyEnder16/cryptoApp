import { Stack } from 'expo-router';

// Anchor the stack at `main` (the real wallet home) so deep-linking from another
// tab — e.g. Home's deposit/transactions shortcuts — seeds the stack as
// [main, <deep>] and stays navigable back to the wallet home. `index` can't be
// the anchor: it's a KYC redirect gate, so anchoring there would fire its
// <Redirect> and drop the deep screen you navigated to.
export const unstable_settings = {
  initialRouteName: 'main',
};

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
