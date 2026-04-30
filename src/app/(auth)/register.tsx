import BackHeader from '@/src/components/BackHeader';
import Btn from '@/src/components/Btn';
import { AuthStyles } from '@/src/components/SignInView';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <BackHeader txt="Sign Up" marginBottom={30} />

      <Text style={[AuthStyles.heading, { marginBottom: 10 }]}>
        Register with mobile
      </Text>

      <Text style={styles.desc}>
        Please type your number, then we’ll send a verification code for
        authentication.
      </Text>

      <View style={AuthStyles.formContainer}>
        <View style={AuthStyles.field}>
          <Text style={AuthStyles.label}>Mobile Number</Text>
          <TextInput
            placeholder="Enter your mobile"
            style={AuthStyles.inputField}
            placeholderTextColor={Colors.ash}
            inputMode="email"
          />
        </View>
      </View>

      <View style={{ marginTop: 60 }}>
        <Btn text="Send OTP" action={() => console.log('hey')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  desc: {
    fontFamily: Fonts.regular,
    color: '#A7AFB7',
    fontSize: 14,
    lineHeight: 24,
  },
});
