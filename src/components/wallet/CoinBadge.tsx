import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../../constants/fonts';
import { Colors } from '../../constants/styles';
import { getSymbolColor } from '../../helpers/getSymbolColor';

interface CoinBadgeProps {
  symbol: string;
  size?: number;
}

/** Round, brand-colored badge showing a coin's first letter. */
export default function CoinBadge({ symbol, size = 40 }: CoinBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getSymbolColor(symbol),
        },
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.42 }]}>
        {symbol.charAt(0)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
});
