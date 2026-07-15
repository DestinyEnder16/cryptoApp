import { Stack } from 'expo-router';

// Anchor the stack at `index` so deep-linking into a nested route from another
// tab (e.g. router.navigate('/markets/watchlist') from Home) always mounts the
// Markets home beneath it, keeping the tab navigable back to its root.
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="trending" />
      <Stack.Screen name="coin" />
      <Stack.Screen name="watchlist" />
      <Stack.Screen name="order-book" />
    </Stack>
  );
}
