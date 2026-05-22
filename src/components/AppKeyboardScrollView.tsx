import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface AppProps {
  children: React.ReactNode;
}

export default function AppKeyboardScrollView({ children }: AppProps) {
  return (
    <KeyboardAwareScrollView
      bottomOffset={30}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ width: '100%' }}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
