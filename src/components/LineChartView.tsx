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
  width?: number;
  height?: number;
  strokeWidth?: number;
};

const DEFAULT_WIDTH = 130;
const DEFAULT_HEIGHT = 50;
const Y_GUTTER = 6;
const DEFAULT_STROKE_WIDTH = 2.5;

export default function LineChartView({
  chartData,
  isNegative,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}: ChartProps) {
  const color = isNegative ? Colors.red : Colors.green;
  // Keep gradient ids unique per size so multiple charts on one screen don't
  // collide on the shared SVG def namespace.
  const gradientId = `lineGradient${isNegative ? 'Neg' : 'Pos'}${width}x${height}`;

  const { linePath, areaPath } = useMemo(
    () => buildPaths(chartData, width, height),
    [chartData, width, height]
  );

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
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
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </Svg>
    </View>
  );
}

function buildPaths(data: ChartData[], width: number, height: number) {
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

  const innerHeight = height - Y_GUTTER * 2;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const ratio = (d.value - min) / (max - min);
    const y = Y_GUTTER + (1 - ratio) * innerHeight;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${width.toFixed(2)},${height} L0,${height} Z`;

  return { linePath, areaPath };
}
