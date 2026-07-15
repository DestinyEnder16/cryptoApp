import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import OnboardingView from '@/src/features/onboarding/components/OnboardingView';
import { carouselData } from '@/src/shared/constants/data';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const isLast = index === carouselData.length - 1;

  const onNext = () => {
    if (isLast) {
      router.replace('/(auth)/auth');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <View style={styles.screen}>
      <FlatList
        ref={listRef}
        data={carouselData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <OnboardingView
            heading={item.heading}
            info={item.info}
            img={item.img}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {carouselData.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primaryBackgroundColor },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', marginBottom: 24 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '100%',
    backgroundColor: Colors.dotInactive,
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: Colors.ash },
  button: {
    backgroundColor: Colors.green,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  buttonText: { color: '#0E1A22', fontFamily: Fonts.regular, fontSize: 18 },
});
