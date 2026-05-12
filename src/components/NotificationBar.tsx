import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { NotificationFilter } from '../constants/images';
import { Colors } from '../constants/styles';

export default function NotificationBar() {
  return (
    <View style={styles.row}>
      <Text style={styles.txt}>Notifications</Text>

      <Pressable>
        <NotificationFilter />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  txt: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 18,
  },
});
