import { homeMenu } from '@/src/constants/data';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function MenuIconsView() {
  return (
    <FlatList
      data={homeMenu}
      contentContainerStyle={{ gap: 50 }}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <View style={styles.field}>
          <Text style={styles.header}>{item.title}</Text>

          <View style={styles.iconField}>
            {item.items.map((el, index) => (
              <View key={index} style={styles.item}>
                <el.icon />
                <Text style={styles.txt}>{el.text}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 18,
  },
  txt: {
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  iconField: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 50,
    alignItems: 'flex-end',
  },
  item: {
    width: '25%',
    alignItems: 'center',
    gap: 8,
  },
  field: {
    gap: 15,
  },
});
