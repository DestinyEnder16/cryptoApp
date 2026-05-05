import HomeIconsView from '@/src/components/HomeIconsView';
import ScreenHeader from '@/src/components/ScreenHeader';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeIndex() {
  const insets = useSafeAreaInsets();

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
