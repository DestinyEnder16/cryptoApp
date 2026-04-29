import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';
import AltLoginView from './AltLoginView';
import Btn from './Btn';

function SignInView() {
  const { width } = useWindowDimensions();
  return (
    <View style={[AuthStyles.container, { width }]}>
      <Text style={AuthStyles.heading}>Sign in</Text>
      {/* sign-in form fields go here */}

      <View style={AuthStyles.formContainer}>
        <View style={AuthStyles.field}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={AuthStyles.label}>Email</Text>
            <Pressable>
              <Text style={{ color: Colors.green }}>Sign In with mobile</Text>
            </Pressable>
          </View>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={Colors.ash}
            style={AuthStyles.inputField}
            keyboardType="email-address"
          />
        </View>

        <View style={AuthStyles.field}>
          <Text style={AuthStyles.label}>Password</Text>

          <TextInput
            placeholder="Enter your password"
            placeholderTextColor={Colors.ash}
            style={AuthStyles.inputField}
            keyboardType="email-address"
          />
          <Text style={{ color: Colors.green, fontFamily: Fonts.regular }}>
            Forgot password?
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 40 }}>
        <Btn text="Sign In" action={() => console.log('hey')} />
      </View>

      <AltLoginView />
    </View>
  );
}

export const AuthStyles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  formContainer: { gap: 40, marginTop: 60 },
  heading: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#A7AFB7',
  },
  inputField: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
});

export default SignInView;
