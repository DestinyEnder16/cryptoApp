import { Pressable, StyleSheet, Text } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface BtnProps {
  text: string;
  action?: () => void;
  disabled?: boolean;
  fontSize?: number;
}

export default function Btn({
  text,
  action,
  disabled = false,
  fontSize,
}: BtnProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={action}
      style={[btnStyles.container, disabled && { backgroundColor: '#669080' }]}
    >
      <Text style={[btnStyles.text, fontSize !== undefined && { fontSize }]}>
        {text}
      </Text>
    </Pressable>
  );
}

const btnStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.green,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
  },
  text: {
    fontFamily: Fonts.medium,
    color: Colors.dark,
    fontSize: 18,
  },
});
