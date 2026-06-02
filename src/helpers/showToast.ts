import Toast from 'react-native-toast-message';
import { Fonts } from '../constants/fonts';

type ToastType = 'success' | 'error' | 'info';
type ToastPosition = 'top' | 'bottom';

type ToastOptions = {
  type: ToastType;
  position?: ToastPosition;
  title: string;
  message: string;
};

export function showToast({
  type,
  position = 'top',
  title,
  message,
}: ToastOptions) {
  Toast.show({
    type,
    text1: title,
    text2: message,
    text2Style: { fontFamily: Fonts.medium, fontSize: 13 },
    topOffset: 50,
    position,
    visibilityTime: type === 'error' ? 10000 : 4000,
  });
}
