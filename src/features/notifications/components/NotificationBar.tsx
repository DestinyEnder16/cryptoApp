import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/src/shared/constants/fonts';
import { NotificationFilter } from '@/src/shared/constants/images';
import { Colors } from '@/src/shared/constants/styles';

type BarProps = {
  length: number;
};

export default function NotificationBar({ length }: BarProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.txt}>Notifications</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {length > 0 && (
          <Pressable>
            <Text style={{ color: Colors.ash }}>Mark All As Read</Text>
          </Pressable>
        )}
        <Pressable>
          <NotificationFilter />
        </Pressable>
      </View>
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
