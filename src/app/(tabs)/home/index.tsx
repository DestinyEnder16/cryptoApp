import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useFetchTrendingAssetsQuery } from '@/src/store/api/marketApi';
import { setTrendingCoins } from '@/src/store/slices/coinSlice';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

export default function HomeIndex() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { data, isLoading } = useFetchTrendingAssetsQuery();

  useEffect(() => {
    if (!data) return;
    dispatch(setTrendingCoins(data.map((datum) => datum.symbol)));
  }, [data, dispatch]);

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.text,
    flex: 1,
  },
  headerSpacing: {
    backgroundColor: Colors.primaryBackgroundColor,
  },
  scroll: { flex: 1, backgroundColor: Colors.text },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 30,
  },
  img: { width: '100%', height: 78 },
  buttonsContainer: {
    gap: 10,
  },
  stripsContainer: { marginTop: 30, gap: 35 },
  txt: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primaryBackgroundColor,
  },
});
