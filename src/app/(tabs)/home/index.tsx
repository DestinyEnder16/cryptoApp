import HomeIconsView from "@/src/components/HomeIconsView";
import MarketStrip from "@/src/components/HomeMarketsStrip";

import ScreenHeader from "@/src/components/ScreenHeader";
import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import ew from "@/src/lib/tw";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeIndex() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + tabBarHeight,
        },
      ]}
    >
      <View style={[styles.headerSpacing, { paddingTop: insets.top + 10 }]}>
        <ScreenHeader variant="profile" />
      </View>

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
          <View style={ew`h-40 flex-1`}>
            <Text style={styles.txt}>Recent Coin</Text>
            <MarketStrip />
          </View>
          <View style={ew`mt-10`}>
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
    backgroundColor: Colors.text,
    flex: 1,
  },
  headerSpacing: {
    paddingBottom: 20,
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
