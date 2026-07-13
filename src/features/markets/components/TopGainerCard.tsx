import type { CoinData } from '@/src/features/markets/types/coin';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { useFetchAssetDetailsQuery } from '@/src/features/markets/store/marketApi';

const CHART_WIDTH = 200;
const CHART_HEIGHT = 90;
const CHART_PADDING = 8;
const STROKE_WIDTH = 2.5;
const DOT_RADIUS = 5;

// Fallback shape used while /market/assets/{symbol} hasn't resolved yet —
// keeps the SVG from collapsing on the first render.
const placeholderChart = [
  120, 124, 121, 128, 126, 134, 132, 142, 138, 148, 145, 152,
];

interface TopGainerCardProps {
  asset: CoinData;
}

export default function TopGainerCard({ asset }: TopGainerCardProps) {
  const { data: details } = useFetchAssetDetailsQuery(asset.symbol);
  const values =
    details?.chartData && details.chartData.length > 0
      ? details.chartData.map((p) => p.value)
      : placeholderChart;
  const { linePath, lastPoint } = buildChart(values);
  const changeSign = asset.change24h >= 0 ? '+' : '';
  const formattedPrice = `$${asset.priceUsd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>TOP GAINER · 24H</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.left}>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.subtitle}>Highest 24h move</Text>
          <Pressable style={styles.viewBtn}>
            <Text style={styles.viewBtnTxt}>View asset</Text>
          </Pressable>
        </View>

        <View style={styles.right}>
          <Text style={styles.change}>
            {changeSign}
            {asset.change24h.toFixed(2)}%
          </Text>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Path
              d={linePath}
              stroke={Colors.green}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {lastPoint && (
              <Circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r={DOT_RADIUS}
                fill={Colors.green}
              />
            )}
          </Svg>
        </View>
      </View>
    </View>
  );
}

function buildChart(values: number[]) {
  if (values.length === 0) {
    return { linePath: '', lastPoint: null as { x: number; y: number } | null };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const innerH = CHART_HEIGHT - CHART_PADDING * 2;
  const innerW = CHART_WIDTH - DOT_RADIUS;
  const stepX = values.length > 1 ? innerW / (values.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = CHART_PADDING + (1 - (v - min) / range) * innerH;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');

  return { linePath, lastPoint: points[points.length - 1] };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.lime,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 12,
    letterSpacing: 1,
  },
  price: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  left: {
    gap: 6,
    flexShrink: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  name: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 30,
  },
  subtitle: {
    color: Colors.text,
    opacity: 0.85,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  viewBtn: {
    backgroundColor: '#0A4F33',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  viewBtnTxt: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  change: {
    color: Colors.green,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});
