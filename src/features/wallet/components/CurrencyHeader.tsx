import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { currencyConverter } from '@/src/shared/helpers/currencyConverter';

import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

interface CurrencyProps {
  amount: number;
  baseCurrency: 'usd' | 'btc';
}

const GRADIENT_COLORS = ['#5ed5a716', Colors.primaryBackgroundColor] as const;
const GRADIENT_START = { x: 0.5, y: 1 };
const GRADIENT_END = { x: 0.5, y: 0 };
const GRADIENT_LOCATIONS = [0, 0.4] as const;
const FORMAT_OPTIONS = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

function CurrencyHeader({ amount, baseCurrency }: CurrencyProps) {
  const [activeCurrency, setActiveCurrency] = useState(baseCurrency);

  const formatted = useMemo(
    () =>
      currencyConverter(amount, baseCurrency, activeCurrency).toLocaleString(
        'en-US',
        FORMAT_OPTIONS
      ),
    [amount, baseCurrency, activeCurrency]
  );

  const showUsd = useCallback(() => setActiveCurrency('usd'), []);
  const showBtc = useCallback(() => setActiveCurrency('btc'), []);

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={GRADIENT_START}
      end={GRADIENT_END}
      locations={GRADIENT_LOCATIONS}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.row}>
          <Pressable onPress={showUsd}>
            <Text
              style={[styles.txt, activeCurrency === 'usd' && styles.txtActive]}
            >
              USD
            </Text>
          </Pressable>
          <Pressable onPress={showBtc}>
            <Text
              style={[styles.txt, activeCurrency === 'btc' && styles.txtActive]}
            >
              BTC
            </Text>
          </Pressable>
        </View>

        <Text style={styles.amount}>
          {activeCurrency.toUpperCase()} {formatted}
        </Text>
      </View>
    </LinearGradient>
  );
}

export default memo(CurrencyHeader);

const styles = StyleSheet.create({
  gradient: { width: '100%', overflow: 'hidden' },
  container: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  txt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
  },
  txtActive: {
    color: Colors.green,
    fontFamily: Fonts.bold,
  },
  amount: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 28,
  },
});
