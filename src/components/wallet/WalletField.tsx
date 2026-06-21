import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../../constants/fonts';
import { Colors } from '../../constants/styles';

interface WalletFieldProps {
  label: string;
  /** Static value text. Ignored when `children` is provided. */
  value?: string;
  /** Custom content (e.g. a TextInput) rendered under the label. */
  children?: ReactNode;
  /** Turns the field into a tappable selector with a chevron. */
  onPress?: () => void;
}

/**
 * Boxed form field: a small muted label with a value (or arbitrary children)
 * beneath it. The repeated building block across the deposit/withdraw screens.
 */
export default function WalletField({
  label,
  value,
  children,
  onPress,
}: WalletFieldProps) {
  const body = (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.bodyRow}>
        <View style={styles.bodyContent}>
          {children ?? <Text style={styles.value}>{value}</Text>}
        </View>
        {onPress && (
          <Ionicons name="chevron-down" size={18} color={Colors.ash} />
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable style={styles.container} onPress={onPress}>
        {body}
      </Pressable>
    );
  }

  return <View style={styles.container}>{body}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  label: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bodyContent: {
    flex: 1,
  },
  value: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});
