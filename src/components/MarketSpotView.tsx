import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';
import { useFetchSupportedAssetsQuery } from '../store/api/marketApi';
import MarketAssetView from './MarketAssetView';
const supportedColors = [Colors.blue, Colors.green, Colors.orangeBrown];

interface SearchProps {
  text: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
}

function SearchMarketCoins({ text, onChangeText }: SearchProps) {
  return (
    <TextInput
      placeholder="Search coin or symbol"
      style={styles.searchField}
      placeholderTextColor={Colors.textMuted}
      value={text}
      onChangeText={(e) => onChangeText(e)}
    />
  );
}

function MarketSpotView() {
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
        <SearchMarketCoins text={filterText} onChangeText={setFilterText} />
      }
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
  searchField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    paddingHorizontal: 30,
    height: 48,
    borderRadius: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
});

export default MarketSpotView;
