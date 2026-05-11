import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MarketFilters } from '../app/(tabs)/markets';
import { Colors } from '../constants/styles';

interface StripProps {
  activeField: number;
  setActiveField: (id: number) => void;
}

export default function MenuStrip({ activeField, setActiveField }: StripProps) {
  const filters: MarketFilters[] = ['Convert', 'Spot', 'Margin', 'Fiat'];
  return (
    <View style={styles.row}>
      {filters.map((el, index) => (
        <Pressable
          key={index}
          onPress={() => setActiveField(index)}
          style={[styles.field, activeField === index && styles.activeField]}
        >
          <Text style={[styles.txt, activeField === index && styles.activeTxt]}>
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
    paddingHorizontal: 30,
    borderRadius: 12,
    paddingVertical: 5,
  },
  field: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  txt: {
    color: Colors.textMuted,
  },
  activeField: {
    backgroundColor: Colors.primaryBackgroundColor,

    borderRadius: 12,
  },
  activeTxt: {
    color: Colors.text,
  },
});
