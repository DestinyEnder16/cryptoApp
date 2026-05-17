import { FlashList } from '@shopify/flash-list';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { useFetchSupportedAssetsQuery } from '../store/api/Api';
import MarketStripItem from './MarketStripItem';

function MarketStrip() {
  const { data } = useFetchSupportedAssetsQuery();

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
