import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { HomeCoinBtc } from '../constants/images';
import { Colors } from '../constants/styles';
import { useFetchAssetDetailsQuery } from '../store/api/Api';
import LineChartView from './LineChartView';
import MarketStripItemSkeleton from './MarketStripItemSkeleton';

interface MarketStripItemProps {
  coin: string;
}

function MarketStripItem({ coin }: MarketStripItemProps) {
  const { isLoading, data } = useFetchAssetDetailsQuery(coin, {
    pollingInterval: 10000,
  });

  if (isLoading) {
    return <MarketStripItemSkeleton />;
  }

  const isPositive = data?.change24h! > 0;

  const chartData = data?.chart.map((point) => ({
    timestamp: new Date(point.time).getTime(),
    value: point.priceUsd,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.row, { gap: 40 }]}>
        <Text
          style={[
            isPositive ? { color: Colors.green } : { color: Colors.red },
            styles.priceTxt,
          ]}
        >
          {data?.priceUsd}
        </Text>
        <HomeCoinBtc />
      </View>

      <View style={[styles.row, { gap: 10 }]}>
        <Text style={styles.symbolTxt}>{data?.symbol}</Text>
        <Text
          style={[
            isPositive ? { color: Colors.green } : { color: Colors.red },
            styles.changeTxt,
          ]}
        >{`${data?.change24h}%`}</Text>
      </View>

      <LineChartView chartData={chartData!} isNegative={!isPositive} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 165,
    marginRight: 10,
    gap: 10,
    backgroundColor: Colors.text,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTxt: {
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  symbolTxt: {
    fontFamily: Fonts.regular,
    color: Colors.primaryBackgroundColor,
  },
  changeTxt: {
    fontFamily: Fonts.regular,
  },
});

export default memo(MarketStripItem);
