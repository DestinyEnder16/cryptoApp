import { StyleSheet, Text, View } from 'react-native';
import { homeIcons } from '../constants/data';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

export default function HomeIconsView() {
  return (
    <View style={styles.container}>
      {homeIcons.map(({ icon: Icon, text }) => (
        <View key={text} style={styles.item}>
          <Icon />
          <Text style={styles.label}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryBackgroundColor,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 20,
  },
  item: {
    width: '25%',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: Colors.grey,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: Fonts.regular,
  },
});
