import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MarketFilters } from '../app/(tabs)/markets';
import { Colors } from '../constants/styles';

interface StripProps {
  activeField: string;
  setActiveField: React.Dispatch<MarketFilters>;
}

export default function MenuStrip({ activeField, setActiveField }: StripProps) {
  const filters: MarketFilters[] = ['Convert', 'Spot', 'Margin', 'Fiat'];
  return (
    <View style={styles.row}>
      {filters.map((el, index) => (
        <Pressable key={index} onPress={() => setActiveField(el)}>
          <Text style={[styles.txt, activeField === el && styles.activeTxt]}>
            {el}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackgroundColor,
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  txt: {
    color: Colors.textMuted,
  },
  activeTxt: {
    color: Colors.text,
  },
});
