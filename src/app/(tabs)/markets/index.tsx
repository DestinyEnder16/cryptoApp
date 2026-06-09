import AppBackground from '@/src/components/AppBackground';
import MarketSpotView from '@/src/components/MarketSpotView';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Colors } from '@/src/constants/styles';
import { usePadding } from '@/src/hooks/usePadding';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

export type MarketFilters = 'Convert' | 'Fiat' | 'Spot' | 'Margin';

export default function MarketIndex() {
  const tabBarHeight = useBottomTabBarHeight();
  const paddingTop = usePadding();

  return (
    <AppBackground>
      <View
        style={[
          styles.container,
          { paddingTop, paddingBottom: tabBarHeight + 20 },
        ]}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <ScreenIntro
            title="Markets"
            description="Search assets, view live prices, and open a coin detail screen."
          />
        </View>

        <View style={styles.marketView}>
          <MarketSpotView />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marketView: {
    flex: 1,
    marginTop: 30,
  },
  flex1: { flex: 1 },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dashedBtn: {
    borderStyle: 'dashed' as const,
    borderWidth: 1,
    borderColor: Colors.textMuted,
  },
});
