import AppBackground from '@/src/shared/components/AppBackground';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import TransactionRow from '@/src/features/wallet/components/TransactionRow';
import WalletAssetRow from '@/src/features/wallet/components/WalletAssetRow';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatAmount } from '@/src/shared/helpers/formatAmount';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import { showToast } from '@/src/shared/helpers/showToast';
import { useRefresh } from '@/src/shared/hooks/useRefresh';
import {
  useGetDepositAddressesQuery,
  useGetPortfolioHistoryQuery,
  useGetTransactionsQuery,
  useGetWalletQuery,
} from '@/src/features/wallet/store/walletApi';
import type { DepositAddress } from '@/src/features/wallet/types/wallet';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
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
  { label: 'Send', route: '/wallet/send' },
  { label: 'Withdraw', route: '/wallet/withdraw' },
  { label: 'Trade', route: '/(tabs)/trades' },
] as const;

export default function WalletHomeScreen() {
  const { data: wallet, isLoading, refetch: refetchWallet } = useGetWalletQuery();
  const { data: recent, refetch: refetchRecent } = useGetTransactionsQuery({
    limit: 3,
    order: 'desc',
  });
  const { data: day, refetch: refetchDay } = useGetPortfolioHistoryQuery('1D');
  const { data: depositAddresses, refetch: refetchAddresses } =
    useGetDepositAddressesQuery();

  const { refreshControl } = useRefresh(
    refetchWallet,
    refetchRecent,
    refetchDay,
    refetchAddresses
  );

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
          refreshControl={refreshControl}
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

          {depositAddresses && depositAddresses.length > 0 && (
            <>
              <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                <Text style={styles.sectionTitle}>My deposit addresses</Text>
              </View>
              {depositAddresses.map((addr) => (
                <DepositAddressRow key={addr.assetSymbol} addr={addr} />
              ))}
            </>
          )}

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
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 12,
  },
  addrText: {
    flex: 1,
    gap: 4,
  },
  addrSymbol: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  addrValue: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
});

function DepositAddressRow({ addr }: { addr: DepositAddress }) {
  const short =
    addr.address.length > 16
      ? `${addr.address.slice(0, 8)}…${addr.address.slice(-4)}`
      : addr.address;

  const copy = async () => {
    await Clipboard.setStringAsync(addr.address);
    showToast({
      type: 'success',
      title: 'Address copied',
      message: `${addr.assetSymbol} deposit address copied to clipboard.`,
    });
  };

  return (
    <Pressable style={styles.addrRow} onPress={copy}>
      <View style={styles.addrText}>
        <Text style={styles.addrSymbol}>
          {addr.assetSymbol} · {addr.network}
        </Text>
        <Text style={styles.addrValue}>{short}</Text>
      </View>
      <Ionicons name="copy-outline" size={18} color={Colors.ash} />
    </Pressable>
  );
}
