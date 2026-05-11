import { Text, useWindowDimensions, View } from 'react-native';
import { Colors } from '../constants/styles';

function MarketMarginView() {
  const { width } = useWindowDimensions();
  return (
    <View style={{ paddingTop: 20, width, paddingHorizontal: 15 }}>
      <Text style={{ color: Colors.text }}>Margin</Text>
    </View>
  );
}

export default MarketMarginView;
