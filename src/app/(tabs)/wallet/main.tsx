import TrendingAssetItem from "@/src/components/TrendingAssetItem";
import WalletHeader from "@/src/components/WalletHeader";
import { Colors } from "@/src/constants/styles";
import { useFetchTrendingAssetsQuery } from "@/src/store/api/Api";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

export default function Wallet() {
  const { data } = useFetchTrendingAssetsQuery(undefined, {
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
  });
  return (
    <View style={styles.container}>
      <WalletHeader />
      <View style={styles.listWrapper}>
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<ActivityIndicator />}
          renderItem={renderItem}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews
        />
      </View>
    </View>
  );
}

const keyExtractor = (item: { id: string }) => item.id;

const renderItem = ({
  item,
}: {
  item: { name: string; symbol: string; priceUsd: number };
}) => (
  <TrendingAssetItem
    name={item.name}
    symbol={item.symbol}
    priceUsd={item.priceUsd}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 20,
  },
});
