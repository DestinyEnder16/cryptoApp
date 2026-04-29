import { Pressable, StyleSheet, Text } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface BtnProps {
  text: string;
  action: () => void;
  styles?: { backgroundColor: string; txtColor: string };
}

export default function Btn({ text, action }: BtnProps) {
  return (
    <Pressable onPress={action} style={btnStyles.container}>
      <Text style={btnStyles.text}>{text}</Text>
    </Pressable>
  );
}

const btnStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.green,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  text: {
    fontFamily: Fonts.medium,
    color: Colors.dark,
    fontSize: 18,
  },
});
