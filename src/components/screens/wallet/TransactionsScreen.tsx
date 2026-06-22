import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import TransactionRow from '@/src/components/wallet/TransactionRow';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { sandboxTransactions } from '@/src/data/sandboxWallet';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const FILTERS = [
  { label: 'All', match: () => true },
  { label: 'Deposits', match: (type: string) => type === 'deposit' },
  { label: 'Withdrawals', match: (type: string) => type === 'withdrawal' },
] as const;

export default function TransactionsScreen() {
  const [active, setActive] = useState(0);

  const filtered = sandboxTransactions.filter((tx) =>
    FILTERS[active].match(tx.type)
  );

  return (
    <AppBackground>
      <ScreenIntro
        title="Transactions"
        description="Deposits, withdrawals, buys, sells, and swaps."
        hasBackBtn
      />

      <View style={styles.filterRow}>
        {FILTERS.map((filter, index) => (
          <Pressable
            key={filter.label}
            style={[styles.filter, active === index && styles.filterActive]}
            onPress={() => setActive(index)}
          >
            <Text
              style={[
                styles.filterTxt,
                active === index && styles.filterTxtActive,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
      >
        {filtered.map((tx) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            onPress={() => router.navigate(`/wallet/transactions/${tx.id}`)}
          />
        ))}
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 32,
  },
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  filterActive: {
    backgroundColor: Colors.green,
  },
  filterTxt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  filterTxtActive: {
    color: Colors.dark,
  },
});
