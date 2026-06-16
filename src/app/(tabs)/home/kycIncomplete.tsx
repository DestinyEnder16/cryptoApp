import AppBackground from '@/src/components/AppBackground';
import { LoadingIcon } from '@/src/components/LoadingSpinner';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useFetchTrendingAssetsQuery } from '@/src/store/api/marketApi';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function KycIncomplete() {
  const { data: user } = useFetchMeQuery();
  const firstName = user?.fullName?.split(' ')[0] ?? '';
  const tier = user?.verification?.label ?? 'Starter level';
  const { data: trending, isLoading: trendingLoading } =
    useFetchTrendingAssetsQuery(undefined, {
      pollingInterval: 10000,
    });
  const topTrending = trending?.slice(0, 3) ?? [];

  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hello, {firstName}</Text>
          <Text style={styles.subtitle}>
            Your portfolio is growing. Complete verification to unlock trading
            and withdrawals.
          </Text>
        </View>

        <View style={styles.portfolioCard}>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>{tier}</Text>
          </View>
          <Text style={styles.portfolioAmount}>$2,918.42</Text>
          <Text style={styles.portfolioLabel}>Portfolio balance</Text>
        </View>

        <Pressable
          style={styles.verifyCard}
          onPress={() => console.log('verify!!!')}
        >
          <View style={styles.warningIcon}>
            <Text style={styles.warningIconText}>!</Text>
          </View>

          <View style={styles.verifyContent}>
            <Text style={styles.verifyTitle}>Verify to trade</Text>
            <Text style={styles.verifyDesc}>
              Trading and withdrawals are locked until your identity is
              approved.
            </Text>
          </View>

          <Text style={styles.verifyAction}>Start</Text>
        </Pressable>

        <View style={styles.trendingSection}>
          <Text style={styles.trendingHeading}>Trending assets</Text>

          {trendingLoading ? (
            <View style={styles.trendingLoader}>
              <LoadingIcon />
            </View>
          ) : (
            topTrending.map((asset) => {
              const positive = asset.change24h >= 0;
              return (
                <View key={asset.symbol} style={styles.trendingRow}>
                  <Text style={styles.trendingSymbol}>{asset.symbol}</Text>
                  <Text
                    style={[
                      styles.trendingChange,
                      { color: positive ? Colors.green : Colors.red },
                    ]}
                  >
                    {positive ? '+' : ''}
                    {asset.change24h.toFixed(1)}%
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  header: {
    gap: 6,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 26,
  },
  subtitle: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  portfolioCard: {
    backgroundColor: Colors.lime,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#04241A',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tierBadgeText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  portfolioAmount: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 30,
  },
  portfolioLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    height: 130,
  },
  warningIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconText: {
    color: Colors.orangeBrown,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  verifyContent: {
    flex: 1,
    gap: 4,
  },
  verifyTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  verifyDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  verifyAction: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  trendingSection: {
    gap: 12,
  },
  trendingHeading: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  trendingSymbol: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  trendingChange: {
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  trendingLoader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
});
