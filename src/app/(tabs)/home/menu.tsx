import MenuHeader from '@/src/components/MenuHeader';
import MenuIconsView from '@/src/components/MenuIconsView';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Menu() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <MenuHeader />

      <View style={styles.body}>
        <MenuIconsView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundColor,
    flex: 1,
  },
  body: {
    paddingTop: 30,
    paddingHorizontal: 15,
    flex: 1,
  },
});

export default Menu;
