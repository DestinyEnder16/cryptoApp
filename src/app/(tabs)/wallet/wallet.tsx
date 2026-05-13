import TrendingAssetItem from "@/src/components/TrendingAssetItem";
import WalletHeader from "@/src/components/WalletHeader";
import { Colors } from "@/src/constants/styles";
import { useFetchTrendingAssetsQuery } from "@/src/store/api/Api";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

export default function Wallet() {
  const { data } = useFetchTrendingAssetsQuery(undefined, {
    pollingInterval: 10000,
  });
  return (
    <View style={styles.container}>
      <WalletHeader />
      <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<ActivityIndicator />}
          renderItem={({ item }) => (
            <TrendingAssetItem
              name={item.name}
              symbol={item.symbol}
              priceUsd={item.priceUsd}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
  },
});
