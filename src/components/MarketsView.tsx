import { useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '../constants/styles';
import { useFetchSupportedAssetsQuery } from '../store/api/marketApi';
import MarketActionsStrip from './MarketActionsStrip';
import MarketAssetView from './MarketAssetView';
import SearchMarketCoins from './SearchMarketCoins';

const supportedColors = [Colors.blue, Colors.green, Colors.orangeBrown];

function MarketsView() {
  const { data: assets } = useFetchSupportedAssetsQuery();
  const { width } = useWindowDimensions();
  const [filterText, setFilterText] = useState('');

  // NOTE PROBLEM - The search field can only search using the symbols

  // SOLUTION - Right now, we only receive the symbols of supported assets, try to get the coin name too. That should allow us filter the coin name too
  const query = filterText.trim().toLowerCase();
  const data =
    query.length > 0
      ? (assets ?? []).filter((asset) => asset.toLowerCase().includes(query))
      : assets;

  return (
    <FlatList
      style={{ width }}
      contentContainerStyle={styles.content}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <SearchMarketCoins text={filterText} onChangeText={setFilterText} />
          <MarketActionsStrip />
        </>
      }
      ListHeaderComponentStyle={{
        marginBottom: 30,
        gap: 20,
      }}
    />
  );
}

const keyExtractor = (item: string) => item;
const renderItem = ({ item, index }: { item: string; index: number }) => (
  <MarketAssetView
    coin={item}
    color={supportedColors[index % supportedColors.length]}
  />
);

const styles = StyleSheet.create({
  content: { paddingTop: 30, paddingHorizontal: 15, gap: 10 },
});

export default MarketsView;
