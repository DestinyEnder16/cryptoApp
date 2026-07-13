import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/src/shared/constants/styles';
import MarketActionBtn from './MarketActionBtn';

export default function MarketActionsStrip() {
  return (
    <View style={styles.actionBtnsStrip}>
      <MarketActionBtn
        text="All"
        backgroundColor={Colors.green}
        txtColor={Colors.dark}
        action={() => console.log('hello')}
      />
      <MarketActionBtn
        text="Gainers"
        backgroundColor={Colors.secondaryBackgroundColor}
        txtColor={Colors.text}
        action={() => router.push('/markets/trending')}
      />
      <MarketActionBtn
        text="Watchlist"
        backgroundColor={Colors.secondaryBackgroundColor}
        txtColor={Colors.text}
        action={() => router.push('/markets/watchlist')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionBtnsStrip: {
    flexDirection: 'row',
    gap: 10,
  },
});
