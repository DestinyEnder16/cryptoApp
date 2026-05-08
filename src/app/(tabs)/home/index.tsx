import HomeIconsView from '@/src/components/HomeIconsView';

import ScreenHeader from '@/src/components/ScreenHeader';
import { Colors } from '@/src/constants/styles';
import { useFetchSupportedAssetsQuery } from '@/src/store/api/Api';
import { useAppDispatch } from '@/src/store/hooks';
import { addSupportedMarkets } from '@/src/store/slices/apiSlice';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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

      <View style={{ flex: 1, backgroundColor: Colors.text }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundColor,
    flex: 1,
  },
});
