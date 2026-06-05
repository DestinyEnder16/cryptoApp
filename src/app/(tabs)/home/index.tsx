import AppBackground from '@/src/components/AppBackground';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeIndex() {
  return (
    <AppBackground>
      <View>
        <Text>Home</Text>
        <Text>Welcome back, </Text>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.text,
    flex: 1,
  },
  headerSpacing: {
    backgroundColor: Colors.primaryBackgroundColor,
  },
  scroll: { flex: 1, backgroundColor: Colors.text },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 30,
  },
  img: { width: '100%', height: 78 },
  buttonsContainer: {
    gap: 10,
  },
  stripsContainer: { marginTop: 30, gap: 35 },
  txt: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primaryBackgroundColor,
  },
});
