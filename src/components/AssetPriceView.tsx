import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { BtcCoin } from '../constants/images';
import { Colors } from '../constants/styles';
import { useFetchAssetDetailsQuery } from '../store/api/Api';
import AssetDetailSkeleton from './AssetDetailsSkeleton';
import LineChartView from './LineChartView';

interface AssetProps {
  coin: string;
}

export default function AssetPriceView({ coin }: AssetProps) {
  const { isLoading, data } = useFetchAssetDetailsQuery(coin, {
    // SOLUTION: This variable tells RTK Query how often the data is to be re-fetched
    pollingInterval: 10000,
  });

  const chartData = data?.chart.map((point) => ({
    timestamp: new Date(point.time).getTime(),
    value: point.priceUsd,
  }));

  return isLoading ? (
    <AssetDetailSkeleton />
  ) : (
    <View
      style={[
        styles.row,
        {
          justifyContent: 'space-between',
          paddingVertical: 15,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.ash,
          alignItems: 'center',
        },
      ]}
    >
      <View style={[styles.row, { gap: 10 }]}>
        <BtcCoin />

        <View style={{ gap: 5 }}>
          <Text style={styles.info}>{data?.name}</Text>
          <Text style={{ color: Colors.ash, fontFamily: Fonts.regular }}>
            {coin}
          </Text>
        </View>
      </View>

      <LineChartView chartData={chartData!} isNegative={data?.change24h! < 0} />

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.info}>{data?.priceUsd}</Text>
        <Text
          style={[styles.price, data?.change24h! < 0 && { color: Colors.red }]}
        >
          {data?.change24h}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  info: { color: Colors.text, fontFamily: Fonts.bold },
  price: {
    color: Colors.green,
    fontFamily: Fonts.medium,
  },
});
