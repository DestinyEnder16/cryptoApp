import AppBackground from '@/src/components/AppBackground';
import LineChartView from '@/src/components/LineChartView';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatPrice } from '@/src/helpers/formatPrice';
import { useGetPortfolioHistoryQuery } from '@/src/store/api/walletApi';
import type { PortfolioRange } from '@/src/types/wallet/types';
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
  const changePct =
    first && latest != null ? ((latest - first) / first) * 100 : null;
  const up = (changePct ?? 0) >= 0;

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
              isNegative={!up}
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

        {latest != null && (
          <View style={styles.summary}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Current value</Text>
              <Text style={styles.summarySub}>Change over {range}</Text>
            </View>
            <View style={styles.summaryAmounts}>
              <Text style={styles.summaryValue}>{formatPrice(latest)}</Text>
              {changePct !== null && (
                <Text
                  style={[
                    styles.summaryChange,
                    { color: up ? Colors.green : Colors.red },
                  ]}
                >
                  {up ? '+' : ''}
                  {changePct.toFixed(2)}%
                </Text>
              )}
            </View>
          </View>
        )}
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
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  summaryInfo: {
    flex: 1,
    gap: 4,
  },
  summaryLabel: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  summarySub: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  summaryAmounts: {
    alignItems: 'flex-end',
    gap: 4,
  },
  summaryValue: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  summaryChange: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
});
