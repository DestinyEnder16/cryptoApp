import { Stack } from 'expo-router';

// Anchor the stack at `index` so deep-linking into a nested route from another
// tab (e.g. router.navigate('/profile/createAlert')) always mounts the Profile
// home beneath it. Without this the stack is rootless — back exits to the
// previous tab and the Profile tab gets stuck showing the deep screen.
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="createAlert" />
      <Stack.Screen name="alertCreated" />
      <Stack.Screen name="priceAlerts" />
    </Stack>
  );
}
