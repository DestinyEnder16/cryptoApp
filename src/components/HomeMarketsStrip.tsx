import { memo } from "react";
import { StyleSheet } from "react-native";
import { useFetchSupportedAssetsQuery } from "../store/api/Api";
import Loader from "./Loader";
import MarketStripItem from "./MarketStripItem";
import { FlashList } from "@shopify/flash-list";

function MarketStrip() {
  const { isLoading, data } = useFetchSupportedAssetsQuery();

  if (isLoading) {
    return <Loader />;
  }

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
  return <MarketStripItem coin={item} />;
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

export default memo(MarketStrip);
