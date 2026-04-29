import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
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

type Mode = 'email' | 'mobile';

type AuthMethodComponentProps = {
  label: string;
  instruction: string;
  to: Mode;
};

function SignInView() {
  const { width } = useWindowDimensions();
  const [mode, setMode] = useState<Mode>('email');

  function AuthMethod({ label, instruction, to }: AuthMethodComponentProps) {
    return (
      <>
        <Text style={AuthStyles.label}>{label}</Text>
        <Pressable onPress={() => setMode(to)}>
          <Text style={{ color: Colors.green }}>{instruction}</Text>
        </Pressable>
      </>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primaryBackgroundColor, Colors.secondaryBackgroundColor]}
    >
      <View style={[AuthStyles.container, { width }]}>
        <Text style={AuthStyles.heading}>Sign in</Text>
        {/* sign-in form fields go here */}

        <View style={AuthStyles.formContainer}>
          <View style={AuthStyles.field}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              {mode === 'email' ? (
                <AuthMethod
                  label="Email"
                  instruction="Sign in with mobile"
                  to="mobile"
                />
              ) : (
                <AuthMethod
                  label="Mobile Number"
                  instruction="Sign in with email"
                  to="email"
                />
              )}
            </View>

            <TextInput
              placeholder={`Enter your ${mode}`}
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
    </LinearGradient>
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
