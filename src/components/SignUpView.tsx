import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Colors } from '../constants/styles';
import Btn from './Btn';
import { AuthStyles } from './SignInView';

function SignUpView() {
  const { width } = useWindowDimensions();
  return (
    <View style={[AuthStyles.container, { width }]}>
      <Text style={AuthStyles.heading}>Sign in</Text>
      {/* sign-in form fields go here */}

      <View style={AuthStyles.formContainer}>
        <View style={AuthStyles.field}>
          <Text style={AuthStyles.label}>Email</Text>
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
        </View>
      </View>

      <View style={{ marginTop: 40 }}>
        <Btn text="Sign In" action={() => console.log('hey')} />
      </View>
    </View>
  );
}

export default SignUpView;
