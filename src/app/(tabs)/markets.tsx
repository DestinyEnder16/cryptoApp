import MarketSpotView from '@/src/components/MarketSpotView';
import MenuStrip from '@/src/components/MenuStrip';
import ScreenHeader from '@/src/components/ScreenHeader';
import { Colors } from '@/src/constants/styles';
import { useAppSelector } from '@/src/store/hooks';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type MarketFilters = 'Convert' | 'Fiat' | 'Spot' | 'Margin';

export default function Markets() {
  const insets = useSafeAreaInsets();
  const [activeField, setActiveField] = useState<MarketFilters>('Convert');
  const supportedMarkets = useAppSelector((state) => state.api.supportedAssets);
  console.log(supportedMarkets);
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScreenHeader variant="profile" />

      <View style={styles.marketView}>
        <MenuStrip activeField={activeField} setActiveField={setActiveField} />

        <ScrollView>
          <MarketSpotView />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  marketView: {
    paddingHorizontal: 15,
    marginTop: 30,
  },
});
