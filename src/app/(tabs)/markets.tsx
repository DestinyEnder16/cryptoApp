import AppBackground from '@/src/components/AppBackground';
import MarketSpotView from '@/src/components/MarketSpotView';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Colors } from '@/src/constants/styles';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type MarketFilters = 'Convert' | 'Fiat' | 'Spot' | 'Margin';

export default function Markets() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <AppBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 10, paddingBottom: tabBarHeight + 20 },
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
