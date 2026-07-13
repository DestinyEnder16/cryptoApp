import AppBackground from '@/src/shared/components/AppBackground';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import TransactionRow from '@/src/features/wallet/components/TransactionRow';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { useRefresh } from '@/src/shared/hooks/useRefresh';
import { useGetTransactionsQuery } from '@/src/features/wallet/store/walletApi';
import type { TransactionType } from '@/src/features/wallet/types/wallet';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const FILTERS: { label: string; type?: TransactionType }[] = [
  { label: 'All' },
  { label: 'Deposits', type: 'deposit' },
  { label: 'Withdrawals', type: 'withdrawal' },
];

export default function TransactionsScreen() {
  const [active, setActive] = useState(0);
  const type = FILTERS[active].type;
  const { data, isLoading, refetch } = useGetTransactionsQuery(
    type ? { type, order: 'desc' } : { order: 'desc' }
  );
  const { refreshControl } = useRefresh(refetch);

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

      {isLoading ? (
        <ActivityIndicator
          color={Colors.green}
          style={{ marginTop: 40 }}
          size="large"
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          refreshControl={refreshControl}
        >
          {data?.length ? (
            data.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                onPress={() => router.navigate(`/wallet/transactions/${tx.id}`)}
              />
            ))
          ) : (
            <Text style={styles.empty}>No transactions yet.</Text>
          )}
        </ScrollView>
      )}
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
  empty: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
});
