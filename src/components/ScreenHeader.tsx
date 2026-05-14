import { Image } from "expo-image";
import { router } from "expo-router";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Colors } from "../constants/styles";
import {
  CurrencyIcon,
  CustomizationIcon,
  FavoriteIcon,
  NotifIcon,
  ScanIcon,
  SearchIcon,
} from "../constants/images";

interface HeaderProps {
  variant: "profile" | "market";
}

const goToSettings = () => router.navigate("/settings");
const goToWalletSearch = () => router.navigate("/wallet/main");
const goToWallet = () => router.navigate("/(tabs)/wallet");
const goToNotifications = () => router.navigate("/home/notifications");

const AVATAR = require("@/assets/images/avatar.png");

function ScreenHeader({ variant }: HeaderProps) {
  const isProfile = variant === "profile";
  const onAvatarPress = useCallback(goToSettings, []);

  return (
    <View style={[styles.rowContainer, styles.outer]}>
      <Pressable onPress={onAvatarPress}>
        <Image
          source={AVATAR}
          contentFit="cover"
          style={styles.avatar}
          transition={150}
          cachePolicy="memory-disk"
        />
      </Pressable>

      <View style={[styles.rowContainer, styles.icons]}>
        {isProfile ? (
          <>
            <Pressable onPress={goToWalletSearch}>
              <SearchIcon />
            </Pressable>
            <Pressable onPress={goToWallet}>
              <ScanIcon />
            </Pressable>
            <Pressable onPress={goToNotifications}>
              <NotifIcon />
            </Pressable>
          </>
        ) : (
          <>
            <CustomizationIcon />
            <CurrencyIcon />
            <FavoriteIcon />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  outer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.primaryBackgroundColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  icons: { gap: 30 },
  avatar: { height: 36, width: 36 },
});

export default memo(ScreenHeader);
