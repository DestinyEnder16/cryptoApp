import { StyleSheet, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface InputProps {
  num: number;
  marginTop: number;
  onFill: React.Dispatch<React.SetStateAction<string>>;
  isDisabled?: boolean;
}

export default function NumInputField({
  num,
  marginTop,
  onFill,
  isDisabled = false,
}: InputProps) {
  return (
    <View style={[styles.container, { marginTop }]}>
      <OtpInput
        placeholder={'*'.repeat(num)}
        numberOfDigits={num}
        disabled={isDisabled}
        focusColor={Colors.green}
        focusStickBlinkingDuration={1000}
        onFilled={(text) => onFill(text)}
        onTextChange={(text) => onFill(text)}
        theme={{
          pinCodeContainerStyle: styles.inputField,
          placeholderTextStyle: { color: Colors.textMuted },
          pinCodeTextStyle: {
            color: Colors.text,
            fontFamily: Fonts.bold,
            fontSize: 32,
          },
        }}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputField: {
    borderRadius: 12,
    width: 50,
    height: 45,
    backgroundColor: '#161C22',
    borderWidth: 0,
  },
});
