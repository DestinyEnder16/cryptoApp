import AppBackground from '@/src/components/AppBackground';
import { LoadingIcon } from '@/src/components/LoadingSpinner';
import ScreenIntro from '@/src/components/ScreenIntro';
import TopGainerCard from '@/src/components/TopGainerCard';
import { usePadding } from '@/src/hooks/usePadding';
import { useFetchTrendingAssetsQuery } from '@/src/store/api/marketApi';
import { View } from 'react-native';

export default function Trending() {
  const paddingTop = usePadding();

  const { data: trendingAssets, isLoading } = useFetchTrendingAssetsQuery();
  const topAsset = trendingAssets?.[0];

  return (
    <AppBackground>
      <View style={{ paddingTop, paddingHorizontal: 20, gap: 20 }}>
        <ScreenIntro
          title="Trending"
          description="Top moving assets from the simulated market feed."
        />
        {isLoading || !topAsset ? (
          <LoadingIcon />
        ) : (
          <TopGainerCard asset={topAsset} />
        )}
      </View>
    </AppBackground>
  );
}
