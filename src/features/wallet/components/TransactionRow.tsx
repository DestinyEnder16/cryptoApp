import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { describeTransaction } from '@/src/features/wallet/helpers/describeTransaction';
import { formatTxDate } from '@/src/features/wallet/helpers/formatTxDate';
import type { Transaction, TransactionType } from '@/src/features/wallet/types/wallet';

interface TransactionRowProps {
  tx: Transaction;
  onPress?: () => void;
}

const ICONS: Record<TransactionType, keyof typeof Ionicons.glyphMap> = {
  deposit: 'arrow-down',
  withdrawal: 'arrow-up',
  buy: 'cart',
  sell: 'pricetag',
  swap: 'swap-horizontal',
  transfer: 'swap-vertical',
};

const amountColor = (direction: 'credit' | 'debit' | 'neutral') =>
  direction === 'credit'
    ? Colors.green
    : direction === 'debit'
    ? Colors.red
    : Colors.text;

const statusLabel = (status: Transaction['status']) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function TransactionRow({ tx, onPress }: TransactionRowProps) {
  const display = describeTransaction(tx);

  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name={ICONS[tx.type]} size={18} color={Colors.green} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{display.title}</Text>
        <Text style={styles.sub}>
          {statusLabel(tx.status)} · {formatTxDate(tx.createdAt)}
        </Text>
      </View>

      <Text style={[styles.amount, { color: amountColor(display.direction) }]}>
        {display.amountLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  sub: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  amount: {
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
});
