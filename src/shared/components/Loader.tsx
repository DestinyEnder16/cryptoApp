import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/styles';

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
