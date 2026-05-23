import ActionBtn from "@/src/components/ActionBtn";

import MarketSpotView from "@/src/components/MarketSpotView";
import ScreenHeader from "@/src/components/ScreenHeader";
import { AddBtn } from "@/src/constants/images";
import { Colors } from "@/src/constants/styles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MarketFilters = "Convert" | "Fiat" | "Spot" | "Margin";

export default function Markets() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 10, paddingBottom: tabBarHeight + 20 },
      ]}
    >
      <ScreenHeader variant="profile" />

      <View style={styles.marketView}>
        <MarketSpotView />
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
