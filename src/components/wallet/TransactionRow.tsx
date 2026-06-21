import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../../constants/fonts';
import { Colors } from '../../constants/styles';
import type {
  SandboxTransaction,
  SandboxTxType,
} from '../../data/sandboxWallet';

interface TransactionRowProps {
  tx: SandboxTransaction;
  onPress?: () => void;
}

const ICONS: Record<SandboxTxType, keyof typeof Ionicons.glyphMap> = {
  deposit: 'arrow-down',
  withdrawal: 'arrow-up',
  buy: 'cart',
  sell: 'pricetag',
  swap: 'swap-horizontal',
  alert: 'notifications',
};

const amountColor = (direction: SandboxTransaction['direction']) =>
  direction === 'credit'
    ? Colors.green
    : direction === 'debit'
    ? Colors.red
    : Colors.text;

export default function TransactionRow({ tx, onPress }: TransactionRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name={ICONS[tx.type]} size={18} color={Colors.green} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{tx.title}</Text>
        <Text style={styles.sub}>
          {tx.status === 'pending' ? 'Pending' : 'Completed'} · {tx.date}
        </Text>
      </View>

      <Text style={[styles.amount, { color: amountColor(tx.direction) }]}>
        {tx.amountLabel}
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
