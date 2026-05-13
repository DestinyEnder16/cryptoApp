import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useFetchSupportedAssetsQuery } from '../store/api/Api';
import AssetPriceView from './AssetPriceView';

function MarketSpotView() {
  const { data: assets } = useFetchSupportedAssetsQuery();
  const { width } = useWindowDimensions();
  return (
    <FlatList
      style={{ width }}
      contentContainerStyle={styles.content}
      data={assets}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

const keyExtractor = (item: string) => item;
const renderItem = ({ item }: { item: string }) => <AssetPriceView coin={item} />;

const styles = StyleSheet.create({
  content: { paddingTop: 20, paddingHorizontal: 15 },
});

export default MarketSpotView;
