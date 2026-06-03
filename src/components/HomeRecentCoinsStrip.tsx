import { FlashList } from "@shopify/flash-list";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { useFetchSupportedAssetsQuery } from "../store/api/marketApi";
import CoinItem from "./CoinItem";

function HomeRecentCoinsStrip() {
  const { data } = useFetchSupportedAssetsQuery();

  return (
    <FlashList
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      drawDistance={100}
    />
  );
}

const keyExtractor = (symbol: string) => symbol;
const renderItem = ({ item }: { item: string }) => {
  return <CoinItem coin={item} />;
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

export default memo(HomeRecentCoinsStrip);
