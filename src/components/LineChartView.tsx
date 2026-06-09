import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Colors } from '../constants/styles';

type ChartData = {
  timestamp: number;
  value: number;
};

type ChartProps = {
  chartData: ChartData[];
  isNegative: boolean;
};

const CHART_WIDTH = 130;
const CHART_HEIGHT = 50;
const Y_GUTTER = 6;
const STROKE_WIDTH = 2.5;

export default function LineChartView({ chartData, isNegative }: ChartProps) {
  const color = isNegative ? Colors.red : Colors.green;
  const gradientId = isNegative ? 'lineGradientNeg' : 'lineGradientPos';

  const { linePath, areaPath } = useMemo(
    () => buildPaths(chartData),
    [chartData]
  );

  return (
    <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.3} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {areaPath && <Path d={areaPath} fill={`url(#${gradientId})`} />}
        {linePath && (
          <Path
            d={linePath}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </Svg>
    </View>
  );
}

function buildPaths(data: ChartData[]) {
  if (!data || data.length === 0) {
    return { linePath: '', areaPath: '' };
  }

  const values = data.map((d) => d.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }

  const innerHeight = CHART_HEIGHT - Y_GUTTER * 2;
  const stepX = data.length > 1 ? CHART_WIDTH / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const ratio = (d.value - min) / (max - min);
    const y = Y_GUTTER + (1 - ratio) * innerHeight;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${CHART_WIDTH.toFixed(
    2
  )},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`;

  return { linePath, areaPath };
}
