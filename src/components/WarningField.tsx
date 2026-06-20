import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface WarningFieldProps {
  message: string;
}

export default function WarningField({ message }: WarningFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeTxt}>!</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: Colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTxt: {
    color: Colors.orangeBrown,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  message: {
    flex: 1,
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
