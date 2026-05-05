import MenuIconsView from '@/src/components/MenuIconsView';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, View } from 'react-native';

function Menu() {
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 30 }}>
        <MenuIconsView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundColor,
    paddingHorizontal: 15,
    flexGrow: 1,
  },
});

export default Menu;
