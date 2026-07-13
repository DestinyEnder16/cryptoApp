import { StyleSheet, View } from 'react-native';
import { Colors } from '@/src/shared/constants/styles';

export default function Index() {
  return <View style={styles.screen} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primaryBackgroundColor },
});
