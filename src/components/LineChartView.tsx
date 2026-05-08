import { LineChart, LineChartProvider } from 'react-native-wagmi-charts';
import { Colors } from '../constants/styles';

type ChartData = {
  timestamp: number;
  value: number;
};

type ChartProps = {
  chartData: ChartData[];
  isNegative: boolean;
};

export default function LineChartView({ chartData, isNegative }: ChartProps) {
  const color = isNegative ? Colors.red : Colors.green;

  return (
    <LineChartProvider data={chartData}>
      <LineChart width={100} height={55}>
        <LineChart.Path
          color={color}
          width={2}
          pathProps={{ isTransitionEnabled: false }}
        />
      </LineChart>
    </LineChartProvider>
  );
}
