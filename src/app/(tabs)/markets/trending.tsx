import AppBackground from '@/src/components/AppBackground';
import { LoadingIcon } from '@/src/components/LoadingSpinner';
import MarketAssetView from '@/src/components/MarketAssetView';
import ScreenIntro from '@/src/components/ScreenIntro';
import TopGainerCard from '@/src/components/TopGainerCard';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { getSymbolColor } from '@/src/helpers/getSymbolColor';
import {
  useFetchAssetDetailsQuery,
  useFetchTrendingAssetsQuery,
} from '@/src/store/api/marketApi';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';

type Timeframe = '1H' | '1D' | '1W' | '1M' | '1Y';
const TIMEFRAMES: Timeframe[] = ['1H', '1D', '1W', '1M', '1Y'];

export default function Trending() {
  const {
    data: trendingAssets,
    isLoading,
    isFetching,
  } = useFetchTrendingAssetsQuery();
  const topAsset = trendingAssets?.[0];
  const rest = trendingAssets?.slice(1) ?? [];

  const avgChange =
    trendingAssets && trendingAssets.length > 0
      ? trendingAssets.reduce((sum, a) => sum + a.change24h, 0) /
        trendingAssets.length
      : 0;

  return (
    <AppBackground>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenIntro
          title="Trending"
          description="Top moving assets from the simulated market feed."
        />

        {isLoading || !topAsset ? (
          <LoadingIcon />
        ) : (
          <>
            <TopGainerCard asset={topAsset} />
            <MarketPulseCard
              avgChange={avgChange}
              topSymbol={topAsset.symbol}
              isRefreshing={isFetching}
            />
            <View style={{ gap: 12 }}>
              {rest.map((asset) => (
                <MarketAssetView
                  key={asset.symbol}
                  coin={asset.symbol}
                  color={getSymbolColor(asset.symbol)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </AppBackground>
  );
}

interface MarketPulseCardProps {
  avgChange: number;
  topSymbol: string;
  isRefreshing: boolean;
}

/**
 * Placeholder market pulse: averages change24h across the trending list and
 * borrows the top asset's chart as a stand-in for an aggregate market trend.
 * Swap for a dedicated /market/pulse endpoint when available.
 */
function MarketPulseCard({
  avgChange,
  topSymbol,
  isRefreshing,
}: MarketPulseCardProps) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 20 * 2 - 16 * 2;
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const { data: top } = useFetchAssetDetailsQuery(topSymbol);
  const chartData = top?.chartData ?? [];

  const isNegative = avgChange < 0;
  const color = isNegative ? Colors.red : Colors.green;
  const sign = avgChange >= 0 ? '+' : '';

  return (
    <View style={styles.pulseCard}>
      <View style={styles.pulseHeader}>
        <Text style={styles.pulseTitle}>Market pulse</Text>
        <Text style={[styles.pulseAvg, { color }]}>
          {sign}
          {avgChange.toFixed(1)}% avg
        </Text>
      </View>
      <View style={styles.pulseSubHeader}>
        <Text style={styles.pulseSub}>Simulated live feed</Text>
        <Text style={styles.pulseRefreshing}>
          {isRefreshing ? 'Refreshing' : 'Live'}
        </Text>
      </View>

      <View style={{ width: chartWidth, height: 80, marginTop: 10 }}>
        {chartData.length > 0 && (
          <LineChart.Provider data={chartData}>
            <LineChart width={chartWidth} height={80}>
              <LineChart.Path color={color} width={2}>
                <LineChart.Gradient />
              </LineChart.Path>
            </LineChart>
          </LineChart.Provider>
        )}
      </View>

      <View style={styles.timeframeRow}>
        {TIMEFRAMES.map((tf) => {
          const active = tf === timeframe;
          return (
            <Pressable
              key={tf}
              onPress={() => setTimeframe(tf)}
              style={[
                styles.timeframePill,
                active && styles.timeframePillActive,
              ]}
            >
              <Text
                style={[
                  styles.timeframeText,
                  active && styles.timeframeTextActive,
                ]}
              >
                {tf}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pulseCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 18,
    padding: 16,
  },
  pulseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pulseTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  pulseAvg: {
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  pulseSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  pulseSub: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  pulseRefreshing: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  timeframeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeframePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  timeframePillActive: {
    backgroundColor: Colors.green,
  },
  timeframeText: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  timeframeTextActive: {
    color: '#0E1A22',
  },
});
