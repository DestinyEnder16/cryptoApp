import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native";
import { useAppSelector } from "../store/hooks";
import CoinItem from "./CoinItem";

export default function HomeTrendingCoinStrip() {
  const { trendingCoins } = useAppSelector((state) => state.coin);
  return (
    <FlashList
      data={trendingCoins}
      contentContainerStyle={styles.strip}
      horizontal
      renderItem={({ item }) => <CoinItem coin={item} />}
    />
  );
}

const styles = StyleSheet.create({
  strip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
