import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';
import { useFetchAssetDetailsQuery } from '../store/api/marketApi';
import LineChartView from './LineChartView';
import MarketAssetSkeleton from './MarketAssetSkeleton';

interface AssetProps {
  coin: string;
  color: string;
}

function MarketAssetView({ coin, color }: AssetProps) {
  const { isLoading, data } = useFetchAssetDetailsQuery(coin, {
    pollingInterval: 20000,
    skipPollingIfUnfocused: true,
  });

  if (isLoading || !data) {
    return <MarketAssetSkeleton />;
  }

  const isNegative = data.change24h < 0;

  return (
    <View style={styles.container}>
      <View style={{ gap: 10, flexDirection: 'row' }}>
        <View
          style={[
            styles.row,
            styles.coinNameAvatar,
            { backgroundColor: color },
          ]}
        >
          <Text>{data.name.charAt(0)}</Text>
        </View>
        <View style={styles.nameCol}>
          <Text style={styles.info}>{data.name}</Text>
          <Text style={styles.coinSymbol}>{coin}</Text>
        </View>
      </View>

      <LineChartView chartData={data.chartData} isNegative={isNegative} />

      <View style={styles.right}>
        <Text style={styles.info}>${data.priceUsd}</Text>
        <Text style={[styles.price, isNegative && styles.priceNegative]}>
          {data.change24h}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,

    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
  },
  coinNameAvatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row' },
  right: { alignItems: 'flex-end' },
  nameCol: { gap: 5 },
  info: { color: Colors.text, fontFamily: Fonts.bold },
  coinSymbol: { color: Colors.ash, fontFamily: Fonts.regular },
  price: {
    color: Colors.green,
    fontFamily: Fonts.medium,
  },
  priceNegative: { color: Colors.red },
});

export default memo(MarketAssetView);
