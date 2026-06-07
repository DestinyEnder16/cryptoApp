import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface ScreenIntroProps {
  title: string;
  description?: string;
}

export default function ScreenIntro({ title, description }: ScreenIntroProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 24,
  },
  description: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
  },
});
