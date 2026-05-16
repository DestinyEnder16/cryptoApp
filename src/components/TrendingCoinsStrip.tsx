import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';
import { useAppSelector } from '../store/hooks';
import MarketStripItem from './MarketStripItem';

export default function TrendingCoinStrip() {
  const { trendingCoins } = useAppSelector((state) => state.coin);
  return (
    <FlashList
      data={trendingCoins}
      style={styles.strip}
      horizontal
      renderItem={({ item }) => <MarketStripItem coin={item} />}
    />
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
  },
});
