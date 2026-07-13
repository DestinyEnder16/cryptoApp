import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

interface WalletNoteProps {
  title: string;
  message: string;
  tone?: 'info' | 'warning';
}

/** Small informational card used for sandbox notices and warnings. */
export default function WalletNote({
  title,
  message,
  tone = 'info',
}: WalletNoteProps) {
  const warning = tone === 'warning';
  return (
    <View
      style={[
        styles.container,
        warning && { backgroundColor: Colors.brown },
      ]}
    >
      <Text
        style={[styles.title, warning && { color: Colors.orangeBrown }]}
      >
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 8,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  message: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
});
