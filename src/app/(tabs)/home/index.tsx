import HomeIconsView from "@/src/components/HomeIconsView";
import MarketStrip from "@/src/components/HomeMarketsStrip";

import ScreenHeader from "@/src/components/ScreenHeader";
import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import { useFetchSupportedAssetsQuery } from "@/src/store/api/Api";
import { useAppDispatch } from "@/src/store/hooks";
import { addSupportedMarkets } from "@/src/store/slices/apiSlice";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeIndex() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { isLoading, data } = useFetchSupportedAssetsQuery();

  const dispatch = useAppDispatch();

  useEffect(
    function () {
      !isLoading && dispatch(addSupportedMarkets(data));
    },
    [isLoading, data, dispatch],
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + tabBarHeight,
        },
      ]}
    >
      <View
        style={{
          paddingBottom: 20,
        }}
      >
        <ScreenHeader variant="profile" />
      </View>

      <HomeIconsView />

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.text }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 30,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonsContainer}>
          <Pressable>
            <Image
              source={require("@/assets/images/HomeComponentA.png")}
              style={styles.img}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/images/HomeComponentB.png")}
              style={styles.img}
            />
          </Pressable>
        </View>

        <View style={{ marginTop: 30, gap: 35 }}>
          <View>
            <Text style={styles.txt}>Recent Coin</Text>
            <MarketStrip />
          </View>
          <View>
            <Text style={styles.txt}>Top Coin</Text>
            <MarketStrip />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundColor,
    flex: 1,
  },
  img: { width: "100%", height: 78 },
  buttonsContainer: {
    gap: 10,
  },
  txt: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primaryBackgroundColor,
  },
});
