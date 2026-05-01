import { Colors } from '@/src/constants/styles';
import { StyleSheet, View } from 'react-native';

export default function Wallets() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
  },
});
