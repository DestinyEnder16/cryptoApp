import { homeMenu } from '@/src/shared/constants/data';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function MenuIconsView() {
  // getting the tab bar height
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <FlatList
      data={homeMenu}
      contentContainerStyle={{ gap: 50, paddingBottom: tabBarHeight + 50 }}
      showsVerticalScrollIndicator={false}
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
