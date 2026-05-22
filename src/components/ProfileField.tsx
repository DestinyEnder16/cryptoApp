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
  error?: string;
}

const ProfileField = forwardRef<TextInput, ProfileFieldProps>(
  ({ label, error, style, ...rest }, ref) => {
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          placeholderTextColor={Colors.ash}
          style={[styles.input, style]}
          {...rest}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
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
  error: {
    fontFamily: Fonts.regular,
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
});
