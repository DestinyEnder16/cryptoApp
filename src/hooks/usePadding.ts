import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function usePadding() {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + 10;
  return topPadding;
}
