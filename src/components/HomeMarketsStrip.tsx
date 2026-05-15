import { memo, useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useFetchSupportedAssetsQuery } from "../store/api/Api";
import MarketStripItem from "./MarketStripItem";
import { FlashList } from "@shopify/flash-list";

function MarketStrip() {
  const { isLoading, data } = useFetchSupportedAssetsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <FlashList
      style={styles.content}
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
  content: { marginVertical: 20, flex: 1, paddingHorizontal: 10 },
});

export default memo(MarketStrip);
