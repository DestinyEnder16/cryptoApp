import { ScrollView, useWindowDimensions } from 'react-native';
import { useAppSelector } from '../store/hooks';
import AssetPriceView from './AssetPriceView';

function MarketSpotView() {
  const assets = useAppSelector((state) => state.api.supportedAssets);
  const { width } = useWindowDimensions();
  return (
    <ScrollView
      style={{ width }}
      contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 15 }}
      showsVerticalScrollIndicator={false}
    >
      {assets.map((asset, index) => (
        <AssetPriceView key={index} coin={asset} />
      ))}
    </ScrollView>
  );
}

export default MarketSpotView;
