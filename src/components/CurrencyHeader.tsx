import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { currencyConverter } from '../services/currencyConverter';

import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface CurrencyProps {
  amount: number;
  baseCurrency: 'usd' | 'btc';
}

export default function CurrencyHeader({
  amount,
  baseCurrency,
}: CurrencyProps) {
  const [activeCurrency, setActiveCurrency] = useState(baseCurrency);

  return (
    <LinearGradient
      colors={['#5ed5a716', Colors.primaryBackgroundColor]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      locations={[0, 0.4]}
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <View style={styles.container}>
        <View style={styles.row}>
          <Pressable onPress={() => setActiveCurrency('usd')}>
            <Text
              style={[styles.txt, activeCurrency === 'usd' && styles.txtActive]}
            >
              USD
            </Text>
          </Pressable>
          <Pressable onPress={() => setActiveCurrency('btc')}>
            <Text
              style={[styles.txt, activeCurrency === 'btc' && styles.txtActive]}
            >
              BTC
            </Text>
          </Pressable>
        </View>

        <Text style={styles.amount}>
          {activeCurrency.toUpperCase()}{' '}
          {currencyConverter(
            amount,
            baseCurrency,
            activeCurrency
          ).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
