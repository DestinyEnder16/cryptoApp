import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import TransactionRow from '@/src/components/wallet/TransactionRow';
import WalletAssetRow from '@/src/components/wallet/WalletAssetRow';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatAmount } from '@/src/helpers/formatAmount';
import { formatPrice } from '@/src/helpers/formatPrice';
import {
  useGetPortfolioHistoryQuery,
  useGetTransactionsQuery,
  useGetWalletQuery,
} from '@/src/store/api/walletApi';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ACTIONS = [
  { label: 'Deposit', route: '/wallet/deposit' },
  { label: 'Withdraw', route: '/wallet/withdraw' },
  { label: 'Trade', route: '/(tabs)/trades' },
] as const;

export default function WalletHomeScreen() {
  const { data: wallet, isLoading } = useGetWalletQuery();
  const { data: recent } = useGetTransactionsQuery({ limit: 3, order: 'desc' });
  const { data: day } = useGetPortfolioHistoryQuery('1D');

  // Today's move = change from the first 1D point to the latest value.
  const first = day?.data[0]?.valueUsd;
  const changePct =
    first && day ? ((day.meta.latestValueUsd - first) / first) * 100 : null;
  const up = (changePct ?? 0) >= 0;

  return (
    <AppBackground>
      <ScreenIntro
        title="Wallet"
        description="Aggregated in USD from active asset balances."
      />

      {isLoading ? (
        <ActivityIndicator
          color={Colors.green}
          style={{ marginTop: 60 }}
          size="large"
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        >
          <Pressable
            style={styles.valueCard}
            onPress={() => router.navigate('/wallet/portfolio')}
          >
            <Text style={styles.valueLabel}>Total portfolio value</Text>
            <Text style={styles.valueAmount}>
              {formatPrice(wallet?.portfolioValueUsd ?? 0)}
            </Text>
            {changePct !== null && (
              <Text
                style={[
                  styles.valueChange,
                  { color: up ? Colors.green : Colors.red },
                ]}
              >
                {up ? '+' : ''}
                {changePct.toFixed(2)}% today
              </Text>
            )}
          </Pressable>

          <View style={styles.actionRow}>
            {ACTIONS.map((action) => (
              <Pressable
                key={action.label}
                style={styles.action}
                onPress={() => router.navigate(action.route)}
              >
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          {wallet?.wallet.balances.map((b) => (
            <WalletAssetRow
              key={b.assetSymbol}
              symbol={b.assetSymbol}
              title={b.assetSymbol}
              subtitle="Available"
              value={`${formatAmount(b.available)} ${b.assetSymbol}`}
              caption={
                b.locked > 0
                  ? `${formatAmount(b.locked)} locked`
                  : undefined
              }
            />
          ))}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent transactions</Text>
            <Pressable onPress={() => router.navigate('/wallet/transactions')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          {recent?.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              onPress={() => router.navigate(`/wallet/transactions/${tx.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  valueCard: {
    backgroundColor: Colors.lime,
    borderRadius: 20,
    padding: 24,
    gap: 10,
    marginBottom: 20,
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  action: {
    flex: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 10,
  },
  actionLabel: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  sectionTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  seeAll: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 13,
    marginBottom: 14,
  },
});
