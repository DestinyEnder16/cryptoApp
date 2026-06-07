import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TradesLayout() {
  const insets = useSafeAreaInsets();
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
    </Stack>
  );
}
