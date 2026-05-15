import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "../constants/fonts";
import { BtcCoin } from "../constants/images";
import { Colors } from "../constants/styles";
import { useFetchAssetDetailsQuery } from "../store/api/Api";
import AssetDetailSkeleton from "./AssetDetailsSkeleton";
import LineChartView from "./LineChartView";

interface AssetProps {
  coin: string;
}

function AssetPriceView({ coin }: AssetProps) {
  const { isLoading, data } = useFetchAssetDetailsQuery(coin, {
    pollingInterval: 20000,
    skipPollingIfUnfocused: true,
  });

  if (isLoading || !data) {
    return <AssetDetailSkeleton />;
  }

  const isNegative = data.change24h < 0;

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.left]}>
        <BtcCoin />
        <View style={styles.nameCol}>
          <Text style={styles.info}>{data.name}</Text>
          <Text style={styles.coinSymbol}>{coin}</Text>
        </View>
      </View>

      <LineChartView chartData={data.chartData} isNegative={isNegative} />

      <View style={styles.right}>
        <Text style={styles.info}>{data.priceUsd}</Text>
        <Text style={[styles.price, isNegative && styles.priceNegative]}>
          {data.change24h}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.ash,
    alignItems: "center",
  },
  row: { flexDirection: "row" },
  left: { gap: 10 },
  right: { alignItems: "flex-end" },
  nameCol: { gap: 5 },
  info: { color: Colors.text, fontFamily: Fonts.bold },
  coinSymbol: { color: Colors.ash, fontFamily: Fonts.regular },
  price: {
    color: Colors.green,
    fontFamily: Fonts.medium,
  },
  priceNegative: { color: Colors.red },
});

export default memo(AssetPriceView);
