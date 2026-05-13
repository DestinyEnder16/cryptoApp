import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/styles';

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const CARD_WIDTH = 165;
const SHIMMER_COLORS = ['transparent', Colors.grey, 'transparent'] as const;
const SHIMMER_START = { x: 0, y: 0 };
const SHIMMER_END = { x: 1, y: 0 };

function MarketStripItemSkeleton() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const transform = useRef([
    {
      translateX: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-CARD_WIDTH, CARD_WIDTH],
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
      })
    );
    loop.start();
    return () => loop.stop();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.bar, styles.bar70]} />
        <View style={styles.coinIcon} />
      </View>

      <View style={styles.row}>
        <View style={[styles.bar, styles.bar40]} />
        <View style={[styles.bar, styles.bar50]} />
      </View>

      <View style={styles.chart} />

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

export default memo(MarketStripItemSkeleton);

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 10,
    gap: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coinIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.grey,
  },
  bar: {
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
  bar40: { width: 40 },
  bar50: { width: 50 },
  bar70: { width: 70 },
  chart: {
    width: '100%',
    height: 70,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
});
