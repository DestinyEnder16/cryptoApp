import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

// Deterministic mock bars — no Math.random() so no hydration flicker
const BARS = Array.from({ length: 28 }, (_, i) => ({
  isUp: (i * 7 + i * i * 3) % 3 !== 0,
  pct: 30 + ((i * 13 + i * i * 7) % 55), // 30–85% of chart height
}));

function BarChart({ width = 300, height = 80 }: { width?: number; height?: number }) {
  const gap = 3;
  const barW = useMemo(
    () => (width - gap * (BARS.length - 1)) / BARS.length,
    [width]
  );
  return (
    <Svg width={width} height={height}>
      {BARS.map((bar, i) => {
        const barH = (bar.pct / 100) * height;
        return (
          <Rect
            key={i}
            x={i * (barW + gap)}
            y={height - barH}
            width={barW}
            height={barH}
            fill={bar.isUp ? Colors.green : Colors.red}
            rx={2}
          />
        );
      })}
    </Svg>
  );
}

const TIME_FILTERS = ['1m', '5m', '15m', '1h', '1d'];

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
  const [period, setPeriod] = useState<string>('5m');

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
              <Text style={styles.price}>64,200.50</Text>
            </View>
            <View style={styles.changePill}>
              <Text style={styles.changeTxt}>+2.1%</Text>
            </View>
          </View>

          <BarChart width={300} height={80} />

          <View style={styles.filterRow}>
            {TIME_FILTERS.map((f) => (
              <Pressable key={f} onPress={() => setPeriod(f)} hitSlop={8}>
                <Text
                  style={[
                    styles.filterTxt,
                    period === f && styles.filterTxtActive,
                  ]}
                >
                  {f}
                </Text>
              </Pressable>
            ))}
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
    gap: 20,
  },
  filterTxt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  filterTxtActive: {
    color: Colors.text,
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
