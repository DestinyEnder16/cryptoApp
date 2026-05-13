import { ActivityIndicator, FlatList } from 'react-native';
import { useFetchSupportedAssetsQuery } from '../store/api/Api';
import MarketStripItem from './MarketStripItem';

export default function MarketStrip() {
  const { isLoading, data } = useFetchSupportedAssetsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      contentContainerStyle={{ marginTop: 20 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(symbol) => symbol}
      renderItem={({ item }) => <MarketStripItem coin={item} />}
    />
  );
}
