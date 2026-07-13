import AppBackground from '@/src/shared/components/AppBackground';
import LineChartView from '@/src/shared/components/LineChartView';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import { useGetPortfolioHistoryQuery } from '@/src/features/wallet/store/walletApi';
import type { PortfolioPoint, PortfolioRange } from '@/src/features/wallet/types/wallet';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const PERIODS: PortfolioRange[] = ['1D', '1W', '1M', '1Y'];

interface MonthGroup {
  id: string;
  label: string;
  valueUsd: number;
  changePct: number;
}

/**
 * Bucket the time-series points by calendar month (most-recent first).
 * Each bucket's change % is from its first point to its last.
 */
function groupByMonth(points: PortfolioPoint[]): MonthGroup[] {

  const map = new Map<string, PortfolioPoint[]>();

  for (const point of points) {
    const d = new Date(point.time);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = map.get(key) ?? [];
    bucket.push(point);
    map.set(key, bucket);
  }

  return Array.from(map.entries())
    .map(([key, pts]): MonthGroup => {
      const first = pts[0];
      const last = pts[pts.length - 1];
      const label = new Date(first.time).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      });
      const changePct =
        first.valueUsd > 0
          ? ((last.valueUsd - first.valueUsd) / first.valueUsd) * 100
          : 0;
      return { id: key, label, valueUsd: last.valueUsd, changePct };
    })
    .reverse(); // newest first, matching the screenshot
}

export default function PortfolioHistoryScreen() {
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<PortfolioRange>('1M');
  const { data, isFetching } = useGetPortfolioHistoryQuery(range);

  // AppBackground applies 20px horizontal padding; the card adds 20px each side.
  const chartWidth = width - 40 - 40;

  const points = data?.data ?? [];
  const chartData = points.map((p) => ({
    timestamp: new Date(p.time).getTime(),
    value: p.valueUsd,
  }));

  const first = points[0]?.valueUsd;
  const latest = data?.meta.latestValueUsd;
  const overallUp = latest != null && first != null ? latest >= first : true;

  const months = groupByMonth(points);

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
          {isFetching ? (
            <ActivityIndicator color={Colors.green} style={{ height: 180 }} />
          ) : (
            <LineChartView
              chartData={chartData}
              isNegative={!overallUp}
              width={chartWidth}
              height={180}
              strokeWidth={3}
            />
          )}

          <View style={styles.periodRow}>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                style={[styles.period, range === p && styles.periodActive]}
                onPress={() => setRange(p)}
              >
                <Text
                  style={[
                    styles.periodTxt,
                    range === p && styles.periodTxtActive,
                  ]}
                >
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {months.map((row) => {
          const positive = row.changePct >= 0;
          return (
            <View key={row.id} style={styles.historyRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: positive ? Colors.green : Colors.red },
                ]}
              >
                <Text style={styles.badgeLetter}>P</Text>
              </View>

              <View style={styles.historyInfo}>
                <Text style={styles.historyMonth}>{row.label}</Text>
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
                  {row.changePct.toFixed(1)}%
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
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLetter: {
    color: Colors.dark,
    fontFamily: Fonts.bold,
    fontSize: 16,
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
