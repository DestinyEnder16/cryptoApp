import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export default function AppKeyboardView({ children }: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      // iOS needs padding adjustment, Android usually needs height or nothing
      behavior={'height'}
      // Tweaked offset for modern iOS notches/dynamic islands
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
