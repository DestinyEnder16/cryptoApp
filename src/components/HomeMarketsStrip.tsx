import { memo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useFetchSupportedAssetsQuery } from '../store/api/Api';
import MarketStripItem from './MarketStripItem';

const CARD_WIDTH = 165;
const CARD_MARGIN = 10;
const ITEM_TOTAL = CARD_WIDTH + CARD_MARGIN;

function MarketStrip() {
  const { isLoading, data } = useFetchSupportedAssetsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      getItemLayout={getItemLayout}
      removeClippedSubviews
    />
  );
}

const keyExtractor = (symbol: string) => symbol;
const renderItem = ({ item }: { item: string }) => <MarketStripItem coin={item} />;
const getItemLayout = (_: ArrayLike<string> | null | undefined, index: number) => ({
  length: ITEM_TOTAL,
  offset: ITEM_TOTAL * index,
  index,
});

const styles = StyleSheet.create({
  content: { marginTop: 20 },
});

export default memo(MarketStrip);
