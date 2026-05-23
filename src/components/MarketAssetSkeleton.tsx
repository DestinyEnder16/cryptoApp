import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import { Colors } from "../constants/styles";

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const { width } = Dimensions.get("window");
const SHIMMER_COLORS = ["transparent", Colors.grey, "transparent"] as const;
const SHIMMER_START = { x: 0, y: 0 };
const SHIMMER_END = { x: 1, y: 0 };

function MarketAssetSkeleton() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const transform = useRef([
    {
      translateX: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
      }),
    },
  ]).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.left]}>
        <View style={styles.coinIcon} />
        <View style={styles.barCol}>
          <View style={[styles.bar, styles.bar80]} />
          <View style={[styles.bar, styles.bar50]} />
        </View>
      </View>

      <View style={styles.chart} />

      <View style={[styles.barCol, styles.right]}>
        <View style={[styles.bar, styles.bar70]} />
        <View style={[styles.bar, styles.bar40]} />
      </View>

      <AnimatedLG
        colors={SHIMMER_COLORS}
        start={SHIMMER_START}
        end={SHIMMER_END}
        style={[StyleSheet.absoluteFill, { transform }]}
        pointerEvents="none"
      />
    </View>
  );
}

export default memo(MarketAssetSkeleton);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.ash,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.grey,
  },
  left: { gap: 10 },
  right: { alignItems: "flex-end" },
  barCol: { gap: 6 },
  bar: {
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
  bar40: { width: 40 },
  bar50: { width: 50 },
  bar70: { width: 70 },
  bar80: { width: 80 },
  chart: {
    width: 130,
    height: 70,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
});
