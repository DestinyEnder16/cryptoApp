import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '../constants/styles';

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const { width } = Dimensions.get('window');

export default function AssetDetailSkeleton() {
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
    outputRange: [-width, width],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.row, { gap: 10 }]}>
        <View style={styles.coinIcon} />
        <View style={{ gap: 6 }}>
          <View style={[styles.bar, { width: 80 }]} />
          <View style={[styles.bar, { width: 50 }]} />
        </View>
      </View>

      <View style={styles.chart} />

      <View style={{ gap: 6, alignItems: 'flex-end' }}>
        <View style={[styles.bar, { width: 70 }]} />
        <View style={[styles.bar, { width: 40 }]} />
      </View>

      <AnimatedLG
        colors={['transparent', Colors.ash, 'transparent']}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.ash,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.grey,
  },
  bar: {
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
  chart: {
    width: 80,
    height: 30,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
});
