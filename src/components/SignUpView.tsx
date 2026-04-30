import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Colors } from '../constants/styles';
import AltLoginView from './AltLoginView';
import AuthMethod from './AuthMethod';
import Btn from './Btn';
import { AuthStyles } from './SignInView';

function SignUpView() {
  const { width } = useWindowDimensions();

  return (
    <LinearGradient
      colors={[Colors.primaryBackgroundColor, Colors.secondaryBackgroundColor]}
      style={{ flex: 1 }}
    >
      <View style={[AuthStyles.container, { width }]}>
        <Text style={AuthStyles.heading}>Sign Up</Text>
        {/* sign-in form fields go here */}

        <View style={AuthStyles.formContainer}>
          <View style={AuthStyles.field}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <AuthMethod
                label="Email"
                instruction="Register with mobile"
                onPress={() => router.navigate('/register')}
              />
            </View>
            <TextInput
              placeholder="Please enter your email"
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
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <Btn text="Sign Up" action={() => console.log('hey')} />
        </View>

        <AltLoginView showFingerPrintOption={false} />
      </View>
    </LinearGradient>
  );
}

export default SignUpView;
