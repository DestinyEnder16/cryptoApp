import BackHeader from "@/src/components/BackHeader";
import { Fonts } from "@/src/constants/fonts";
import {
  ClipboardIcon,
  HomeMenuAvatar,
  ThreeDots,
} from "@/src/constants/images";
import { Colors } from "@/src/constants/styles";
import { useFetchMeQuery } from "@/src/store/api/profileApi";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const GRADIENT_COLORS = ["#5ed5a716", Colors.primaryBackgroundColor] as const;
const GRADIENT_START = { x: 0.5, y: 1 };
const GRADIENT_END = { x: 0.5, y: 0 };
const GRADIENT_LOCATIONS = [0, 0.4] as const;

const goToProfile = () => router.navigate("/profile");

function MenuHeader() {
  const { data: user } = useFetchMeQuery();
  const name = user?.fullName;
  const userId = user?.id ?? "";

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setStringAsync(userId);
  }, [userId]);

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={GRADIENT_START}
      end={GRADIENT_END}
      locations={GRADIENT_LOCATIONS}
      style={styles.gradient}
    >
      <View style={{ gap: 15 }}>
        <View style={[styles.row, styles.topRow]}>
          <BackHeader txt="Menu" marginBottom={30} />
          <ThreeDots />
        </View>

        <View style={styles.row}>
          <View style={styles.profile}>
            <HomeMenuAvatar />
            <View style={styles.nameCol}>
              <Text style={styles.name}>{name}</Text>
              <View style={styles.idRow}>
                <Text style={styles.idTxt}>ID: {userId}</Text>

                <Pressable onPress={copyToClipboard}>
                  <ClipboardIcon />
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable style={styles.editBtn} onPress={goToProfile}>
            <Text style={styles.editTxt}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

export default memo(MenuHeader);

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topRow: { alignItems: "baseline" },
  profile: {
    flexDirection: "row",
    gap: 10,
  },
  nameCol: { gap: 5 },
  name: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  idTxt: { color: Colors.ash },
  idRow: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    backgroundColor: Colors.green,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  editTxt: { fontFamily: Fonts.regular },
});
