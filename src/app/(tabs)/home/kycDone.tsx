import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { describeTransaction } from '@/src/features/wallet/helpers/describeTransaction';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import { useVerification } from '@/src/features/kyc/hooks/useVerification';
import { useFetchTrendingAssetsQuery } from '@/src/features/markets/store/marketApi';
import { useFetchMeQuery } from '@/src/features/profile/store/profileApi';
import {
  useGetPortfolioHistoryQuery,
  useGetTransactionsQuery,
  useGetWalletQuery,
} from '@/src/features/wallet/store/walletApi';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface InfoRowProps {
  title: string;
  subtitle: string;
  value: string;
  onPress?: () => void;
}

function InfoRow({ title, subtitle, value, onPress }: InfoRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.rowDot} />
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </Pressable>
  );
}

export default function KycDone() {
  const isFocused = useIsFocused();

  const { data: user } = useFetchMeQuery();
  const { data: wallet } = useGetWalletQuery();
  const { data: dayHistory } = useGetPortfolioHistoryQuery('1D');
  const { data: trending } = useFetchTrendingAssetsQuery(undefined, {
    pollingInterval: isFocused ? 10000 : 0,
  });
  const { data: txs } = useGetTransactionsQuery({ limit: 1, order: 'desc' });
  const { label: kycLabel, limits } = useVerification();

  const firstName = user?.fullName?.split(' ')[0] ?? '';

  // Balance + today's change
  const totalUsd = wallet?.portfolioValueUsd ?? 0;
  const dayFirst = dayHistory?.data[0]?.valueUsd;
  const dayLatest = dayHistory?.meta.latestValueUsd;
  const changePct =
    dayFirst && dayLatest ? ((dayLatest - dayFirst) / dayFirst) * 100 : null;
  const changeUp = (changePct ?? 0) >= 0;

  // Trending — top 24h gainer
  const topGainer = trending?.reduce(
    (best, coin) => (coin.change24h > (best?.change24h ?? -Infinity) ? coin : best),
    trending[0]
  );

  // Watchlist — first 3 symbols
  const watchlistSymbols = (user?.watchlist ?? []).slice(0, 3).join(', ');

  // Recent transaction
  const recentTx = txs?.[0];
  const txDisplay = recentTx ? describeTransaction(recentTx) : null;
  const txSubtitle = txDisplay
    ? `${txDisplay.title} ${recentTx?.status}`
    : 'No recent transactions';
  const txValue = txDisplay?.amountLabel ?? '—';

  // KYC
  const tradeLimit = limits?.tradePerTransactionUsd;
  const kycSub = tradeLimit
    ? `${kycLabel} · ${formatPrice(tradeLimit, 0)} trade limit`
    : (kycLabel ?? 'Verified');

  return (
    <AppBackground>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.welcome}>Welcome back, {firstName}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40, gap: 12 }}
      >
        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total balance</Text>
          <Text style={styles.balanceAmount}>{formatPrice(totalUsd)}</Text>
          {changePct !== null && (
            <Text
              style={[
                styles.balanceMeta,
                { color: changeUp ? Colors.green : Colors.red },
              ]}
            >
              {changeUp ? '+' : ''}
              {changePct.toFixed(1)}% today · {kycLabel ?? 'verified'}
            </Text>
          )}
        </View>

        <Btn
          text="Deposit"
          action={() => router.navigate('/wallet/deposit')}
        />

        <View style={{ height: 4 }} />

        {/* Info rows */}
        <InfoRow
          title="Trending"
          subtitle={
            topGainer
              ? `${topGainer.symbol} is top gainer`
              : 'Loading markets…'
          }
          value={
            topGainer
              ? `${topGainer.change24h >= 0 ? '+' : ''}${topGainer.change24h.toFixed(1)}%`
              : '—'
          }
          onPress={() => router.navigate('/markets/trending')}
        />

        <InfoRow
          title="Watchlist"
          subtitle={watchlistSymbols || 'No assets added yet'}
          value="Live"
          onPress={() => router.navigate('/markets/watchlist')}
        />

        <InfoRow
          title="Recent transaction"
          subtitle={txSubtitle}
          value={txValue}
          onPress={() => router.navigate('/wallet/transactions')}
        />

        <InfoRow
          title="KYC status"
          subtitle={kycSub}
          value="OK"
          onPress={() => router.navigate('/(tabs)/profile')}
        />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    paddingBottom: 4,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  welcome: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  balanceCard: {
    backgroundColor: Colors.lime,
    borderRadius: 20,
    padding: 24,
    gap: 8,
  },
  balanceLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  balanceAmount: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 36,
  },
  balanceMeta: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  rowDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.green,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  rowSub: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  rowValue: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
