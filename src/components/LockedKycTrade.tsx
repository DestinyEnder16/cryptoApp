import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

export default function LockedKycTrade() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.pair}>BTC / USDT</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>64,200.50</Text>
          <Text style={styles.change}>+2.1%</Text>
        </View>

        <View style={styles.chartBar} />
      </View>

      <View style={styles.card}>
        <View style={styles.lockedBadge}>
          <Text style={styles.lockedTxt}>Locked</Text>
        </View>

        <Text style={styles.description}>
          Complete KYC before you can request buy,{'\n'}sell, or swap quotes.
        </Text>

        <View style={styles.limitRow}>
          <Text style={styles.limitLabel}>Trade limit</Text>
          <Text style={styles.limitValue}>$0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
    marginTop: 24,
  },
  card: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 14,
  },
  pair: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  price: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  change: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  chartBar: {
    height: 14,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    marginTop: 6,
  },
  lockedBadge: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: 'rgba(221, 75, 75, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  lockedTxt: {
    color: Colors.red,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  description: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
  },
  limitLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  limitValue: {
    color: Colors.red,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
