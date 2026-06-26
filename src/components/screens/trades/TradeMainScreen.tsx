import AppBackground from '@/src/components/AppBackground';
import LineChartView from '@/src/components/LineChartView';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const MOCK_CHART_DATA = [
  { timestamp: 1, value: 63200 },
  { timestamp: 2, value: 63800 },
  { timestamp: 3, value: 63100 },
  { timestamp: 4, value: 64500 },
  { timestamp: 5, value: 64100 },
  { timestamp: 6, value: 65200 },
  { timestamp: 7, value: 64800 },
  { timestamp: 8, value: 63900 },
  { timestamp: 9, value: 64200 },
  { timestamp: 10, value: 64800 },
  { timestamp: 11, value: 65100 },
  { timestamp: 12, value: 64200 },
];

const TIME_FILTERS = ['1h', '1d', '1w', '1m', '1y'] as const;

const ACTIONS = [
  {
    label: 'Buy crypto',
    desc: 'Buy ETH or BTC using your balance',
    tab: 'buy',
    btnLabel: 'Buy',
    btnColor: Colors.lightGreen,
    btnTextColor: Colors.dark,
  },
  {
    label: 'Sell crypto',
    desc: 'Sell ETH or BTC, receive USDT',
    tab: 'sell',
    btnLabel: 'Sell',
    btnColor: Colors.red,
    btnTextColor: Colors.text,
  },
  {
    label: 'Swap assets',
    desc: 'Swap any supported asset pair quickly',
    tab: 'swap',
    btnLabel: 'Swap',
    btnColor: Colors.blue,
    btnTextColor: Colors.text,
  },
] as const;

export default function TradeMainScreen() {
  const [period, setPeriod] = useState<string>('1d');

  return (
    <AppBackground>
      <ScreenIntro
        title="Trade"
        description="Buy, sell, or swap with quotes that expire before execution."
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40, gap: 16 }}
      >
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.pair}>BTC / USDT</Text>
              <Text style={styles.price}>64,200.50</Text>
            </View>
            <Text style={styles.change}>+2.1%</Text>
          </View>

          <LineChartView
            chartData={MOCK_CHART_DATA}
            isNegative={false}
            width={300}
            height={80}
            strokeWidth={2}
          />

          <View style={styles.filterRow}>
            {TIME_FILTERS.map((f) => (
              <Pressable
                key={f}
                onPress={() => setPeriod(f)}
                style={[styles.filterPill, period === f && styles.filterPillActive]}
              >
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

        {ACTIONS.map((a) => (
          <Pressable
            key={a.tab}
            style={styles.actionRow}
            onPress={() => router.navigate(`/trades/buy?tab=${a.tab}`)}
          >
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionDesc}>{a.desc}</Text>
            </View>
            <View style={[styles.actionBtn, { backgroundColor: a.btnColor }]}>
              <Text style={[styles.actionBtnTxt, { color: a.btnTextColor }]}>
                {a.btnLabel}
              </Text>
            </View>
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
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 26,
  },
  change: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 13,
    backgroundColor: Colors.lime,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  filterPillActive: {
    backgroundColor: Colors.lime,
  },
  filterTxt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  filterTxtActive: {
    color: Colors.green,
  },
  actionRow: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionInfo: {
    flex: 1,
    gap: 4,
  },
  actionLabel: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  actionDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionBtnTxt: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
});
