import { View } from 'react-native';
import { useAppSelector } from '../store/hooks';
import AssetPriceView from './AssetPriceView';

function MarketSpotView() {
  const assets = useAppSelector((state) => state.api.supportedAssets);
  return (
    <View style={{ paddingTop: 20 }}>
      {assets.map((asset, index) => (
        <AssetPriceView key={index} coin={asset} />
      ))}
    </View>
  );
}

export default MarketSpotView;
