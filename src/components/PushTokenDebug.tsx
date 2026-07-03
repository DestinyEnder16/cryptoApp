import { showToast } from '@/src/helpers/showToast';
import { getExpoPushToken } from '@/src/services/expoPushToken';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/styles';
import { Fonts } from '../constants/fonts';

// Temporary debug affordance — tap to copy this device's Expo push token for
// pasting into Expo's push notification testing tool. Remove once push is
// verified end-to-end in production.
export default function PushTokenDebug() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getExpoPushToken()
      .then(setToken)
      .catch((err) => setToken(`error: ${err instanceof Error ? err.message : err}`));
  }, []);

  if (!token) return null;

  async function handleCopy() {
    if (!token) return;
    await Clipboard.setStringAsync(token);
    showToast({ type: 'success', title: 'Copied', message: 'Push token copied to clipboard.' });
  }

  return (
    <Pressable onPress={handleCopy}>
      <Text style={styles.text} selectable numberOfLines={2}>
        {token}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 10,
  },
});
