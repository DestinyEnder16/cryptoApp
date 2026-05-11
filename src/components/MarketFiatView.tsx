import { Text, useWindowDimensions, View } from 'react-native';
import { Colors } from '../constants/styles';

function MarketFiatView() {
  const { width } = useWindowDimensions();
  return (
    <View style={{ paddingTop: 20, width, paddingHorizontal: 15 }}>
      <Text style={{ color: Colors.text }}>Fiat</Text>
    </View>
  );
}

export default MarketFiatView;
