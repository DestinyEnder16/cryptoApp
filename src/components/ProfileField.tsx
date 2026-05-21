import { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface ProfileFieldProps extends TextInputProps {
  label: string;
}

const ProfileField = forwardRef<TextInput, ProfileFieldProps>(
  ({ label, style, ...rest }, ref) => {
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          placeholderTextColor={Colors.ash}
          style={[styles.input, style]}
          {...rest}
        />
      </View>
    );
  }
);

ProfileField.displayName = 'ProfileField';

export default ProfileField;

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 6,
  },
  input: {
    color: Colors.text,
    fontFamily: Fonts.regular,
  },
});
