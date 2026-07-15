import { Stack } from 'expo-router';

// Anchor the stack at `main` (the real trade home) so deep-linking from another
// tab — e.g. the coin detail's Buy/Sell/Swap navigating to /trades/buy — seeds
// the stack as [main, buy] and stays navigable back to the trade home.
// `index` can't be the anchor: it's a KYC redirect gate, so anchoring there
// would fire its <Redirect> and drop the deep screen you navigated to.
export const unstable_settings = {
  initialRouteName: 'main',
};

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
