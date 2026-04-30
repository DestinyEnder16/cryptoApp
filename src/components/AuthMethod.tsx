import { Pressable, StyleSheet, Text } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

type AuthMethodProps = {
  label: string;
  instruction: string;
  onPress: () => void;
};

export default function AuthMethod({
  label,
  instruction,
  onPress,
}: AuthMethodProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.link}>{instruction}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#A7AFB7',
  },
  link: {
    color: Colors.green,
  },
});
