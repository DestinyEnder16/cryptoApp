import { memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "../constants/fonts";
import { HomeCoinBtc } from "../constants/images";
import { Colors } from "../constants/styles";
import { useFetchAssetDetailsQuery } from "../store/api/Api";
import LineChartView from "./LineChartView";
import MarketStripItemSkeleton from "./MarketStripItemSkeleton";

interface MarketStripItemProps {
  coin: string;
}

function MarketStripItem({ coin }: MarketStripItemProps) {
  const { isLoading, data } = useFetchAssetDetailsQuery(coin, {
    pollingInterval: 20000,
    skipPollingIfUnfocused: true,
  });

  useEffect(() => {
    console.log("i rerendered", coin);
  }, []);
  if (isLoading || !data) {
    return <MarketStripItemSkeleton />;
  }

  const isPositive = data.change24h > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.priceRow]}>
        <Text style={[styles.priceTxt, isPositive ? styles.green : styles.red]}>
          {data.priceUsd}
        </Text>
        <HomeCoinBtc />
      </View>

      <View style={[styles.row, styles.symbolRow]}>
        <Text style={styles.symbolTxt}>{data.symbol}</Text>
        <Text
          style={[styles.changeTxt, isPositive ? styles.green : styles.red]}
        >{`${data.change24h}%`}</Text>
      </View>

      <LineChartView chartData={data.chartData} isNegative={!isPositive} />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 4,
    height: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceRow: { gap: 40 },
  symbolRow: { gap: 10 },
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
  green: { color: Colors.green },
  red: { color: Colors.red },
});

export default memo(MarketStripItem);
