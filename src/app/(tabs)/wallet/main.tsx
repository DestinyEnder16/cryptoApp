import TrendingAssetItem from "@/src/components/TrendingAssetItem";
import WalletHeader from "@/src/components/WalletHeader";
import { Colors } from "@/src/constants/styles";
import { useFetchTrendingAssetsQuery } from "@/src/store/api/Api";
import { setTrendingCoins } from "@/src/store/slices/coinSlice";
import { FlashList } from "@shopify/flash-list";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

export default function Wallet() {
  const dispatch = useDispatch();
  const { data } = useFetchTrendingAssetsQuery(undefined, {
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setTrendingCoins(data));
    }
  }, [data, dispatch]);

  return (
    <View style={styles.container}>
      <WalletHeader />
      <View style={styles.listWrapper}>
        <FlashList
          data={data}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<ActivityIndicator />}
          renderItem={renderItem}
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
