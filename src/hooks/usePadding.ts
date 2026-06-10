import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function usePadding() {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + 30;
  return topPadding;
}

export function useSafeBottomPadding() {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom;
  return bottomPadding;
}
