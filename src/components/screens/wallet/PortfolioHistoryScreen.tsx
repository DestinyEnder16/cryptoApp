import AppBackground from '@/src/components/AppBackground';
import LineChartView from '@/src/components/LineChartView';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import {
  portfolioChartData,
  portfolioHistory,
} from '@/src/data/sandboxWallet';
import { formatPrice } from '@/src/helpers/formatPrice';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const PERIODS = ['1D', '1W', '1M', '1Y'] as const;

export default function PortfolioHistoryScreen() {
  const { width } = useWindowDimensions();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('1M');

  // AppBackground applies 20px horizontal padding; the card adds 20px each side.
  const chartWidth = width - 40 - 40;

  return (
    <AppBackground>
      <ScreenIntro
        title="Portfolio history"
        description="Track total balance movement over time."
        hasBackBtn
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
      >
        <View style={styles.chartCard}>
          <LineChartView
            chartData={portfolioChartData}
            isNegative={false}
            width={chartWidth}
            height={180}
            strokeWidth={3}
          />

          <View style={styles.periodRow}>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                style={[styles.period, period === p && styles.periodActive]}
                onPress={() => setPeriod(p)}
              >
                <Text
                  style={[
                    styles.periodTxt,
                    period === p && styles.periodTxtActive,
                  ]}
                >
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {portfolioHistory.map((row) => {
          const positive = row.changePct >= 0;
          return (
            <View key={row.id} style={styles.historyRow}>
              <View style={styles.dot} />
              <View style={styles.historyInfo}>
                <Text style={styles.historyMonth}>{row.month}</Text>
                <Text style={styles.historyLabel}>Portfolio value</Text>
              </View>
              <View style={styles.historyAmounts}>
                <Text style={styles.historyValue}>
                  {formatPrice(row.valueUsd)}
                </Text>
                <Text
                  style={[
                    styles.historyChange,
                    { color: positive ? Colors.green : Colors.red },
                  ]}
                >
                  {positive ? '+' : ''}
                  {row.changePct}%
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    gap: 18,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  period: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.primaryBackgroundColor,
  },
  periodActive: {
    backgroundColor: Colors.green,
  },
  periodTxt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  periodTxtActive: {
    color: Colors.dark,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.green,
  },
  historyInfo: {
    flex: 1,
    gap: 4,
  },
  historyMonth: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  historyLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  historyAmounts: {
    alignItems: 'flex-end',
    gap: 4,
  },
  historyValue: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  historyChange: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
});
