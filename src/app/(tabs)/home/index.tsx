import HomeIconsView from "@/src/components/HomeIconsView";
import HomeMarketsStrip from "@/src/components/HomeRecentCoinsStrip";
import MarketStrip from "@/src/components/HomeRecentCoinsStrip";
import Loader from "@/src/components/Loader";
import HomeTrendingCoinStrip from "@/src/components/HomeTrendingCoinStrip";
import TrendingCoinStrip from "@/src/components/HomeTrendingCoinStrip";

import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import { useFetchTrendingAssetsQuery } from "@/src/store/api/marketApi";
import { setTrendingCoins } from "@/src/store/slices/coinSlice";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function HomeIndex() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { data, isLoading } = useFetchTrendingAssetsQuery();

  useEffect(() => {
    if (!data) return;
    dispatch(setTrendingCoins(data.map((datum) => datum.symbol)));
  }, [data, dispatch]);

  return isLoading ? (
    <Loader />
  ) : (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + tabBarHeight,
        },
      ]}
    >
      <HomeIconsView />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonsContainer}>
          <Pressable>
            <Image
              source={require("@/assets/images/HomeComponentA.png")}
              style={styles.img}
              contentFit="cover"
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/images/HomeComponentB.png")}
              style={styles.img}
              contentFit="cover"
            />
          </Pressable>
        </View>

        <View style={styles.stripsContainer}>
          <View>
            <Text style={styles.txt}>Recent Coin</Text>
            <HomeMarketsStrip />
          </View>
          <View>
            <Text style={styles.txt}>Top Coin</Text>
            <HomeTrendingCoinStrip />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.text,
    flex: 1,
  },
  headerSpacing: {
    backgroundColor: Colors.primaryBackgroundColor,
  },
  scroll: { flex: 1, backgroundColor: Colors.text },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 30,
  },
  img: { width: "100%", height: 78 },
  buttonsContainer: {
    gap: 10,
  },
  stripsContainer: { marginTop: 30, gap: 35 },
  txt: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primaryBackgroundColor,
  },
});
