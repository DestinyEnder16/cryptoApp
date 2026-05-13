import { View } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
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
const CHART_HEIGHT = 70;

export default function LineChartView({ chartData, isNegative }: ChartProps) {
  const color = isNegative ? Colors.red : Colors.green;

  return (
    <View
      style={{
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
      }}
    >
      <LineChart.Provider data={chartData}>
        <LineChart width={CHART_WIDTH} height={CHART_HEIGHT} yGutter={6}>
          <LineChart.Path
            color={color}
            width={2.5}
            pathProps={{ isTransitionEnabled: false }}
          >
            <LineChart.Gradient color={color} />
          </LineChart.Path>
        </LineChart>
      </LineChart.Provider>
    </View>
  );
}
