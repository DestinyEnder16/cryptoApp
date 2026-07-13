import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { Colors } from '@/src/shared/constants/styles';

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const { width } = Dimensions.get('window');
const SKELETON_COLOR = 'rgba(255,255,255,0.04)';
const SHIMMER_COLORS = [
  'transparent',
  'rgba(255,255,255,0.03)',
  'transparent',
] as const;
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
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.coinIcon} />
        <View style={styles.nameCol}>
          <View style={[styles.bar, styles.bar70]} />
          <View style={[styles.bar, styles.bar40]} />
        </View>
      </View>

      <View style={styles.chart} />

      <View style={styles.right}>
        <View style={[styles.bar, styles.bar60]} />
        <View style={[styles.bar, styles.bar30]} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    overflow: 'hidden',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  right: { alignItems: 'flex-end', gap: 6 },
  nameCol: { gap: 6 },
  coinIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: SKELETON_COLOR,
  },
  bar: {
    height: 10,
    borderRadius: 4,
    backgroundColor: SKELETON_COLOR,
  },
  bar30: { width: 30 },
  bar40: { width: 40 },
  bar60: { width: 60 },
  bar70: { width: 70 },
  chart: {
    width: 130,
    height: 50,
    borderRadius: 4,
    backgroundColor: SKELETON_COLOR,
  },
});
