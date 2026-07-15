import AppBackground from '@/src/shared/components/AppBackground';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatCompact } from '@/src/features/markets/helpers/formatCompact';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import { getSymbolColor } from '@/src/shared/helpers/getSymbolColor';
import {
  useFetchAssetDetailsQuery,
  useFetchCandlesQuery,
} from '@/src/features/markets/store/marketApi';
import {
  useAddToWatchlistMutation,
  useFetchWatchlistQuery,
  useRemoveFromWatchlistMutation,
} from '@/src/features/markets/store/watchListApi';
import type { Candle, ChartDatum } from '@/src/features/markets/types/coin';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Fragment, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { LineChart } from 'react-native-wagmi-charts';

type Period = '1H' | '1D' | '1W' | '1M' | '1Y';
const PERIODS: Period[] = ['1H', '1D', '1W', '1M', '1Y'];

export default function CoinDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const { data, isLoading, isError } = useFetchAssetDetailsQuery(symbol ?? '', {
    skip: !symbol,
  });
  const { data: candles } = useFetchCandlesQuery(symbol ?? '', {
    skip: !symbol,
  });
  const { data: watchlist } = useFetchWatchlistQuery();
  const [addToWatchlist, { isLoading: isAdding }] = useAddToWatchlistMutation();
  const [removeFromWatchlist, { isLoading: isRemoving }] =
    useRemoveFromWatchlistMutation();
  // Period is local-only for now — backend has no range param yet.
  const [period, setPeriod] = useState<Period>('1W');

  if (!symbol) {
    return (
      <AppBackground>
        <CenterMessage text="Missing coin symbol." />
      </AppBackground>
    );
  }

  if (isLoading || (!data && !isError)) {
    return (
      <AppBackground>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.green} />
        </View>
      </AppBackground>
    );
  }

  if (isError || !data) {
    return (
      <AppBackground>
        <CenterMessage text="Could not load coin details." />
      </AppBackground>
    );
  }

  const isNegative = data.change24h < 0;
  const changeColor = isNegative ? Colors.red : Colors.green;
  const accent = getSymbolColor(data.symbol);
  const initial = data.name.charAt(0).toUpperCase();
  const isWatchlisted = watchlist?.data.some((a) => a.symbol === data.symbol) ?? false;
  const isToggling = isAdding || isRemoving;

  function handleWatchlistToggle() {
    if (isToggling || !data) return;
    if (isWatchlisted) {
      removeFromWatchlist(data.symbol);
    } else {
      addToWatchlist(data.symbol);
    }
  }

  return (
    <AppBackground>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{data.name}</Text>
            <Text style={styles.subtitle}>
              {data.symbol} · {data.network}
            </Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: accent }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(data.priceUsd)}</Text>
          <Text style={[styles.change, { color: changeColor }]}>
            {data.change24h > 0 ? '+' : ''}
            {data.change24h.toFixed(1)}% 24h
          </Text>
        </View>

        <ChartCard
          symbol={data.symbol}
          change24h={data.change24h}
          candles={candles ?? []}
          fallbackLine={data.chartData}
          period={period}
          onPeriodChange={setPeriod}
        />

        <Pressable
          style={styles.buyBtn}
          onPress={() =>
            router.navigate({ pathname: '/trades/buy', params: { tab: 'buy', symbol: data.symbol } })
          }
        >
          <Text style={styles.buyBtnText}>Buy</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <SecondaryAction
            label="Sell"
            onPress={() =>
              router.navigate({ pathname: '/trades/buy', params: { tab: 'sell', symbol: data.symbol } })
            }
          />
          <SecondaryAction
            label="Swap"
            onPress={() =>
              router.navigate({ pathname: '/trades/buy', params: { tab: 'swap', symbol: data.symbol } })
            }
          />
          <SecondaryAction
            label="Alert"
            highlight
            onPress={() =>
              router.navigate({ pathname: '/profile/createAlert', params: { symbol: data.symbol } })
            }
          />
        </View>

        <Pressable
          style={[
            styles.watchlistBtn,
            isWatchlisted && styles.watchlistBtnActive,
          ]}
          onPress={handleWatchlistToggle}
          disabled={isToggling}
        >
          <Ionicons
            name={isWatchlisted ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isWatchlisted ? Colors.green : Colors.ash}
          />
          <Text
            style={[
              styles.watchlistBtnText,
              isWatchlisted && styles.watchlistBtnTextActive,
            ]}
          >
            {isWatchlisted ? 'Saved to Watchlist' : 'Add to Watchlist'}
          </Text>
        </Pressable>

        <View style={styles.statsGrid}>
          <StatCell
            label="Market cap"
            value={formatCompact(data.stats.marketCapUsd, '$')}
          />
          <StatCell
            label="24h volume"
            value={formatCompact(data.stats.volume24hUsd, '$')}
          />
          <StatCell
            label="24h high"
            value={formatPrice(data.stats.high24hUsd, 0)}
          />
          <StatCell
            label="Circulating"
            value={`${formatCompact(data.stats.circulatingSupply)} ${
              data.symbol
            }`}
          />
        </View>

        <Pressable
          style={styles.orderBookBtn}
          onPress={() =>
            router.navigate({
              pathname: '/markets/order-book',
              params: { symbol: data.symbol },
            })
          }
        >
          <Text style={styles.orderBookBtnText}>View order book</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.ash} />
        </Pressable>
      </ScrollView>
    </AppBackground>
  );
}

interface ChartCardProps {
  symbol: string;
  change24h: number;
  candles: Candle[];
  fallbackLine: ChartDatum[];
  period: Period;
  onPeriodChange: (tf: Period) => void;
}

function ChartCard({
  symbol,
  change24h,
  candles,
  fallbackLine,
  period,
  onPeriodChange,
}: ChartCardProps) {
  const { width } = useWindowDimensions();
  // Card padding: outer 20 + card 16 each side = 72 total.
  const chartWidth = width - 20 * 2 - 16 * 2;
  const chartHeight = 160;
  const isNegative = change24h < 0;
  const changeColor = isNegative ? Colors.red : Colors.green;
  const lineColor = isNegative ? Colors.red : Colors.green;

  // Visual-only: slice the array into different windows per period so
  // the chart reshapes on tap. Replace with a real refetch once the
  // endpoint accepts a range/interval param.
  const visibleCandles = useMemo(
    () => sliceCandlesForPeriod(candles, period),
    [candles, period]
  );

  // Derive the line from candle closes so candles + line share an x-axis.
  // Fall back to the /assets/{symbol} chart data if candles haven't loaded.
  const lineData: ChartDatum[] = useMemo(() => {
    if (visibleCandles.length > 0) {
      return visibleCandles.map((c) => ({
        timestamp: new Date(c.time).getTime(),
        value: c.closeUsd,
      }));
    }
    return sliceChartDataForPeriod(fallbackLine, period);
  }, [visibleCandles, fallbackLine, period]);

  return (
    <View style={styles.chartCard}>
      <LineChart.Provider data={lineData}>
        <View style={styles.chartHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.chartTitle}>{symbol} / USD</Text>
            <Text style={styles.chartSubtitle}>
              {periodLabel(period)} ·{' '}
              {visibleCandles.length > 0 ? 'OHLC candles' : 'price trend'}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {/* No cursor — shows the latest data point. Will scrub once
                gesture-handler is fully set up and CursorCrosshair is added back. */}
            <LineChart.PriceText
              format={({ value }) => {
                'worklet';
                const num = Number(value);
                if (Number.isNaN(num)) return '';
                return `$${num.toFixed(2)}`;
              }}
              style={styles.chartPrice}
            />
            <Text style={[styles.chartChange, { color: changeColor }]}>
              {change24h > 0 ? '+' : ''}
              {change24h.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={{ width: chartWidth, height: chartHeight, marginTop: 14 }}>
          <Candlesticks
            data={visibleCandles}
            width={chartWidth}
            height={chartHeight}
          />
          <LineChart width={chartWidth} height={chartHeight}>
            <LineChart.Path color={lineColor} width={2.5}>
              <LineChart.Gradient />
            </LineChart.Path>
          </LineChart>
        </View>

        <View style={styles.periodRow}>
          {PERIODS.map((tf) => {
            const active = tf === period;
            return (
              <Pressable
                key={tf}
                onPress={() => onPeriodChange(tf)}
                style={[
                  styles.periodPill,
                  active && styles.periodPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    active && styles.periodTextActive,
                  ]}
                >
                  {tf}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LineChart.Provider>
    </View>
  );
}

interface CandlesticksProps {
  data: Candle[];
  width: number;
  height: number;
}

/**
 * Real OHLC candles from /market/assets/{symbol}/candles. Each candle has
 * a thin wick spanning high→low and a body spanning open↔close, coloured
 * green when close ≥ open, red otherwise. Sits behind the wagmi LineChart;
 * the line itself is drawn from the same closes so the two layers align.
 */
function Candlesticks({ data, width, height }: CandlesticksProps) {
  const candles = useMemo(() => {
    if (!data || data.length === 0) return [];

    const allPrices = data.flatMap((c) => [c.highUsd, c.lowUsd]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const range = max - min || 1;

    const stepX = width / data.length;
    const bodyWidth = Math.max(stepX * 0.55, 2);
    const wickWidth = 1.5;
    const yFor = (price: number) =>
      height - ((price - min) / range) * height;

    return data.map((c, i) => {
      const isUp = c.closeUsd >= c.openUsd;
      const fill = isUp ? Colors.green : Colors.red;
      const cx = i * stepX + stepX / 2;
      const wickTop = yFor(c.highUsd);
      const wickBottom = yFor(c.lowUsd);
      const bodyTop = yFor(Math.max(c.openUsd, c.closeUsd));
      const bodyBottom = yFor(Math.min(c.openUsd, c.closeUsd));
      const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
      return {
        key: i,
        cx,
        wickTop,
        wickHeight: Math.max(wickBottom - wickTop, 1),
        wickX: cx - wickWidth / 2,
        wickWidth,
        bodyX: cx - bodyWidth / 2,
        bodyTop,
        bodyWidth,
        bodyHeight,
        fill,
      };
    });
  }, [data, width, height]);

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {candles.map((c) => (
        <Fragment key={c.key}>
          <Rect
            x={c.wickX}
            y={c.wickTop}
            width={c.wickWidth}
            height={c.wickHeight}
            fill={c.fill}
            fillOpacity={0.7}
          />
          <Rect
            x={c.bodyX}
            y={c.bodyTop}
            width={c.bodyWidth}
            height={c.bodyHeight}
            fill={c.fill}
            fillOpacity={0.7}
            rx={1}
          />
        </Fragment>
      ))}
    </Svg>
  );
}

function SecondaryAction({
  label,
  highlight,
  onPress,
}: {
  label: string;
  highlight?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.secondaryBtn, highlight && styles.secondaryBtnHighlight]}
      onPress={onPress}
    >
      <Text
        style={[styles.secondaryBtnText, highlight && { color: Colors.green }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function CenterMessage({ text }: { text: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>{text}</Text>
    </View>
  );
}

// Visual-only window per period — last N% of the array. Replace with
// a real refetch (e.g., ?range=1w) once the endpoint supports it.
const PERIOD_RATIOS: { '1H': number; '1D': number; '1W': number; '1M': number; '1Y': number } = {
  '1H': 0.15,
  '1D': 0.35,
  '1W': 0.6,
  '1M': 0.85,
  '1Y': 1,
};

function sliceCandlesForPeriod(data: Candle[], tf: Period) {
  if (data.length === 0) return data;
  const count = Math.max(2, Math.ceil(data.length * PERIOD_RATIOS[tf]));
  return data.slice(-count);
}

function sliceChartDataForPeriod(data: ChartDatum[], tf: Period) {
  if (data.length === 0) return data;
  const count = Math.max(2, Math.ceil(data.length * PERIOD_RATIOS[tf]));
  return data.slice(-count);
}

function periodLabel(tf: Period) {
  switch (tf) {
    case '1H':
      return '1 hour';
    case '1D':
      return '1 day';
    case '1W':
      return '1 week';
    case '1M':
      return '1 month';
    case '1Y':
      return '1 year';
  }
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  backBtnText: {
    color: Colors.text,
    fontSize: 24,
    fontFamily: Fonts.medium,
    lineHeight: 24,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  subtitle: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#0E1A22',
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  watchlistBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ash,
  },
  watchlistBtnActive: {
    borderColor: Colors.green,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  watchlistBtnText: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  watchlistBtnTextActive: {
    color: Colors.green,
  },
  orderBookBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  orderBookBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  price: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  change: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 6,
  },
  chartCard: {
    marginTop: 20,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 18,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chartTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  chartSubtitle: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 12,
    marginTop: 2,
  },
  chartPrice: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  chartChange: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 2,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  periodPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  periodPillActive: {
    backgroundColor: Colors.green,
  },
  periodText: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  periodTextActive: {
    color: '#0E1A22',
  },
  buyBtn: {
    marginTop: 24,
    backgroundColor: Colors.green,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#0E1A22',
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    alignItems: 'center',
  },
  secondaryBtnHighlight: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.green,
  },
  secondaryBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  statsGrid: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCell: {
    width: '48%',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  statLabel: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  statValue: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
    textAlign: 'right',
  },
});
