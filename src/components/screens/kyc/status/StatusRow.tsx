import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, Text, View } from 'react-native';

export function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.ash,
  },
  value: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
});
