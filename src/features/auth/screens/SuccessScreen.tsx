import Btn from "@/src/shared/components/Btn";
import { Fonts } from "@/src/shared/constants/fonts";
import { Colors } from "@/src/shared/constants/styles";
import { showToast } from "@/src/shared/helpers/showToast";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    showToast({
      type: "success",
      title: "Success",
      message: "You have been signed in successfully.",
    });
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/onboarding-bg.png")}
      resizeMode="cover"
    >
      <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
        <Image
          source={require("@/assets/images/success-reg.png")}
          style={{ height: 250 }}
          resizeMode="contain"
        />

        <Text style={styles.heading}>
          Your account has been successfully created!
        </Text>

        <Btn text="Get started" action={() => router.replace("/home")} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    height: "100%",
    alignItems: "center",
    gap: 50,
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: Colors.text,
    lineHeight: 48,
    textAlign: "center",
  },
});
