import HomeIconsView from '@/src/components/HomeIconsView';

import ScreenHeader from '@/src/components/ScreenHeader';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useFetchSupportedAssetsQuery } from '@/src/store/api/Api';
import { useAppDispatch } from '@/src/store/hooks';
import { addSupportedMarkets } from '@/src/store/slices/apiSlice';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeIndex() {
  const insets = useSafeAreaInsets();
  const { isLoading, data } = useFetchSupportedAssetsQuery();

  const dispatch = useAppDispatch();

  useEffect(
    function () {
      !isLoading && dispatch(addSupportedMarkets(data));
    },
    [isLoading, data, dispatch]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View
        style={{
          paddingBottom: 20,
        }}
      >
        <ScreenHeader variant="profile" />
      </View>

      <HomeIconsView />

      <View
        style={{
          flex: 1,
          backgroundColor: Colors.text,
          paddingHorizontal: 15,
          paddingTop: 30,
        }}
      >
        <View style={styles.buttonsContainer}>
          <Pressable>
            <Image
              source={require('@/assets/images/HomeComponentA.png')}
              style={styles.img}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require('@/assets/images/HomeComponentB.png')}
              style={styles.img}
            />
          </Pressable>
        </View>

        <View style={{ marginTop: 30 }}>
          <View>
            <Text style={styles.txt}>Recent Coin</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundColor,
    flex: 1,
  },
  img: { width: '100%', height: 78 },
  buttonsContainer: {
    gap: 10,
  },
  txt: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primaryBackgroundColor,
  },
});
