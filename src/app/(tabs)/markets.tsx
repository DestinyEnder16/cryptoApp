import ActionBtn from "@/src/components/ActionBtn";
import MarketConvertView from "@/src/components/MarketConvertView";
import MarketFiatView from "@/src/components/MarketFiatView";
import MarketMarginView from "@/src/components/MarketMarginView";
import MarketSpotView from "@/src/components/MarketSpotView";
import MenuStrip from "@/src/components/MenuStrip";
import ScreenHeader from "@/src/components/ScreenHeader";
import { AddBtn } from "@/src/constants/images";
import { Colors } from "@/src/constants/styles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MarketFilters = "Convert" | "Fiat" | "Spot" | "Margin";

export default function Markets() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const scrollRef = useRef<ScrollView>(null);
  const [activeField, setActiveField] = useState(1);

  const goTo = useCallback(
    (id: number) => {
      setActiveField(id);
      scrollRef.current?.scrollTo({ x: id * width, animated: true });
    },
    [width],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setActiveField(Math.round(e.nativeEvent.contentOffset.x / width));
    },
    [width],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: activeField * width, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const renderPage = (index: number, node: ReactNode) => {
    const visible = Math.abs(activeField - index) <= 1;
    return (
      <View key={index} style={{ width }}>
        {visible ? node : null}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 10, paddingBottom: tabBarHeight + 20 },
      ]}
    >
      <ScreenHeader variant="profile" />

      <View style={styles.marketView}>
        <MenuStrip activeField={activeField} setActiveField={goTo} />

        <ScrollView
          ref={scrollRef}
          style={styles.flex1}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={onMomentumScrollEnd}
          decelerationRate={"fast"}
        >
          {renderPage(0, <MarketConvertView />)}
          {renderPage(1, <MarketSpotView />)}
          {renderPage(2, <MarketMarginView />)}
          {renderPage(3, <MarketFiatView />)}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <ActionBtn
          text="Add Favorite"
          icon={<AddBtn />}
          styles={dashedBtnStyles}
          style={styles.dashedBtn}
        />
      </View>
    </View>
  );
}

const dashedBtnStyles = {
  backgroundColor: Colors.secondaryBackgroundColor,
  txtColor: Colors.grey,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
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
    borderStyle: "dashed" as const,
    borderWidth: 1,
    borderColor: Colors.textMuted,
  },
});
