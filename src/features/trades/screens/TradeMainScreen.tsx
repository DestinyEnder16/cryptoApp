import AppBackground from '@/src/shared/components/AppBackground';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import {
  useFetchAssetDetailsQuery,
  useFetchCandlesQuery,
} from '@/src/features/markets/store/marketApi';
import type { Candle } from '@/src/features/markets/types/coin';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

// One bar per real OHLC candle: colored by close-vs-open, height scaled to the
// close price within the visible window's high/low range.
function BarChart({
  candles,
  width = 300,
  height = 80,
}: {
  candles: Candle[];
  width?: number;
  height?: number;
}) {
  const gap = 3;
  const bars = useMemo(() => {
    if (candles.length === 0) return [];

    const min = Math.min(...candles.map((c) => c.lowUsd));
    const max = Math.max(...candles.map((c) => c.highUsd));
    const range = max - min || 1;
    const barW = (width - gap * (candles.length - 1)) / candles.length;

    return candles.map((c, i) => {
      const barH = Math.max(((c.closeUsd - min) / range) * height, 2);
      return {
        key: i,
        x: i * (barW + gap),
        y: height - barH,
        w: barW,
        h: barH,
        isUp: c.closeUsd >= c.openUsd,
      };
    });
  }, [candles, width, height]);

  return (
    <Svg width={width} height={height}>
      {bars.map((b) => (
        <Rect
          key={b.key}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={b.isUp ? Colors.green : Colors.red}
          rx={2}
        />
      ))}
    </Svg>
  );
}

const TIME_FILTERS = ['1m', '5m', '15m', '1h', '1d'] as const;
type TimeFilter = (typeof TIME_FILTERS)[number];

// The candles endpoint returns a single fixed series (no interval param), so —
// like the coin detail screen — each filter just windows the array to a
// different number of the most recent candles. Visual, but driven by live data.
const FILTER_BARS: Record<TimeFilter, number> = {
  '1m': 12,
  '5m': 18,
  '15m': 24,
  '1h': 32,
  '1d': 48,
};

const ACTIONS = [
  {
    label: 'Buy crypto',
    desc: 'Pay USDT and receive BTC',
    tab: 'buy',
    dotColor: Colors.lightGreen,
    actionLabel: 'Buy',
    actionColor: Colors.green,
  },
  {
    label: 'Sell crypto',
    desc: 'Sell ETH or BTC back to USDT',
    tab: 'sell',
    dotColor: Colors.red,
    actionLabel: 'Sell',
    actionColor: Colors.red,
  },
  {
    label: 'Swap assets',
    desc: 'Convert between supported coins',
    tab: 'swap',
    dotColor: Colors.lightGreen,
    actionLabel: 'Swap',
    actionColor: Colors.green,
  },
];

export default function TradeMainScreen() {
  const [period, setPeriod] = useState<TimeFilter>('5m');

  const isFocused = useIsFocused();
  const pollOptions = {
    pollingInterval: isFocused ? 20000 : 0,
    skipPollingIfUnfocused: true,
  };

  const { data: btc } = useFetchAssetDetailsQuery('BTC', pollOptions);
  const { data: candles } = useFetchCandlesQuery('BTC', pollOptions);

  const priceText = btc ? formatPrice(btc.priceUsd) : '—';
  const change = btc?.change24h ?? 0;
  const isUp = change >= 0;
  const changeText = `${isUp ? '+' : ''}${change.toFixed(2)}%`;

  const visibleCandles = useMemo(
    () => (candles ?? []).slice(-FILTER_BARS[period]),
    [candles, period]
  );

  return (
    <AppBackground>
      <ScreenIntro
        title="Trade"
        description="Buy, sell, or swap with quotes that expire before execution."
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40, gap: 14 }}
      >
        {/* Price + bar chart card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.pair}>BTC / USDT</Text>
              <Text style={styles.price}>{priceText}</Text>
            </View>
            <View
              style={[
                styles.changePill,
                // Translucent red surface for a down move, mirroring the
                // translucent-surface pattern used elsewhere in the palette.
                { backgroundColor: isUp ? Colors.lime : '#DD4B4B22' },
              ]}
            >
              <Text
                style={[
                  styles.changeTxt,
                  { color: isUp ? Colors.green : Colors.red },
                ]}
              >
                {changeText}
              </Text>
            </View>
          </View>

          <BarChart candles={visibleCandles} width={300} height={80} />

          <View style={styles.filterRow}>
            {TIME_FILTERS.map((f) => {
              const active = period === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setPeriod(f)}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                >
                  <Text
                    style={[
                      styles.filterTxt,
                      active && styles.filterTxtActive,
                    ]}
                  >
                    {f}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Action rows */}
        {ACTIONS.map((a) => (
          <Pressable
            key={a.tab}
            style={styles.actionRow}
            onPress={() => router.navigate(`/trades/buy?tab=${a.tab}`)}
          >
            {/* Colored circle icon */}
            <View style={[styles.actionDot, { backgroundColor: a.dotColor }]} />

            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionDesc}>{a.desc}</Text>
            </View>

            <Text style={[styles.actionAction, { color: a.actionColor }]}>
              {a.actionLabel}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pair: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    marginBottom: 4,
  },
  price: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 36,
  },
  changePill: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  changeTxt: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.primaryBackgroundColor,
    borderRadius: 14,
    padding: 4,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: Colors.dark,
  },
  filterTxt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  filterTxtActive: {
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
  actionRow: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    flexShrink: 0,
  },
  actionInfo: {
    flex: 1,
    gap: 4,
  },
  actionLabel: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  actionDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  actionAction: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    flexShrink: 0,
  },
});
