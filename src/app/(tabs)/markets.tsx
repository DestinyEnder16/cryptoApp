import MarketConvertView from '@/src/components/MarketConvertView';
import MarketFiatView from '@/src/components/MarketFiatView';
import MarketMarginView from '@/src/components/MarketMarginView';
import MarketSpotView from '@/src/components/MarketSpotView';
import MenuStrip from '@/src/components/MenuStrip';
import ScreenHeader from '@/src/components/ScreenHeader';
import { Colors } from '@/src/constants/styles';
import { useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type MarketFilters = 'Convert' | 'Fiat' | 'Spot' | 'Margin';

export default function Markets() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeField, setActiveField] = useState(1);

  const goTo = (id: number) => {
    setActiveField(id);
    scrollRef.current?.scrollTo({ x: id * width, animated: true });
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveField(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: activeField * width, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScreenHeader variant="profile" />

      <View style={styles.marketView}>
        <MenuStrip activeField={activeField} setActiveField={goTo} />

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={onMomentumScrollEnd}
          decelerationRate={'fast'}
        >
          <MarketConvertView />
          <MarketSpotView />
          <MarketMarginView />
          <MarketFiatView />
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
    flex: 1,
    marginTop: 30,
  },
});
