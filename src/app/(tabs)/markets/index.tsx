import AppBackground from '@/src/components/AppBackground';
import MarketsView from '@/src/components/MarketsView';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, View } from 'react-native';

export type MarketFilters = 'Convert' | 'Fiat' | 'Spot' | 'Margin';

export default function MarketIndex() {
  return (
    <AppBackground>
      <View style={styles.container}>
        <ScreenIntro
          title="Markets"
          description="Search assets, view live prices, and open a coin detail screen."
        />

        <View style={styles.marketView}>
          <MarketsView />
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
