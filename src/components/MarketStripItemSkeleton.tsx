import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/styles';

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const CARD_WIDTH = 165;

export default function MarketStripItemSkeleton() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH],
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.bar, { width: 70 }]} />
        <View style={styles.coinIcon} />
      </View>

      <View style={styles.row}>
        <View style={[styles.bar, { width: 40 }]} />
        <View style={[styles.bar, { width: 50 }]} />
      </View>

      <View style={styles.chart} />

      <AnimatedLG
        colors={['transparent', Colors.grey, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
        pointerEvents="none"
      />
    </View>
  );
}

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
  chart: {
    width: '100%',
    height: 70,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
});
