import AppBackground from '@/src/components/AppBackground';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Wallet() {
  const insets = useSafeAreaInsets();

  return (
    <AppBackground>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <Text style={styles.subtitle}>
            Aggregated in USD from active asset balances.
          </Text>
        </View>

        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>Total portfolio value</Text>
          <Text style={styles.valueAmount}>$4,892.40</Text>
          <Text style={styles.valueChange}>+3.8% today</Text>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    gap: 6,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  subtitle: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  valueCard: {
    backgroundColor: Colors.lime,
    borderRadius: 20,
    padding: 24,
    gap: 10,
  },
  valueLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  valueAmount: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 36,
  },
  valueChange: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
});
