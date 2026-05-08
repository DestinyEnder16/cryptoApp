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
  return (
    <LineChartProvider data={chartData}>
      <LineChart width={90} height={50} yGutter={42}>
        <LineChart.Path
          color={isNegative ? Colors.error : Colors.green}
          width={1.5}
          pathProps={{ isTransitionEnabled: false }}
        />
      </LineChart>
    </LineChartProvider>
  );
}
