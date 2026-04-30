import { yupResolver } from '@hookform/resolvers/yup';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import * as yup from 'yup';
import { Colors } from '../constants/styles';
import { signUpSchema } from '../schemas/basicFormSchema';
import AltLoginView from './AltLoginView';
import AuthMethod from './AuthMethod';
import Btn from './Btn';
import { AuthStyles } from './SignInView';

function SignUpView() {
  const { width } = useWindowDimensions();

  // IMPORTANT: Creating the form handler
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(signUpSchema),
    // NOTE: Schema is imported
  });

  const onSubmit = (data: yup.InferType<typeof signUpSchema>) => {
    console.log(data);
    reset();
  };

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

            {/* IMPORTANT: Linking the input to the RHF */}
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Please enter your email"
                  placeholderTextColor={Colors.ash}
                  style={AuthStyles.inputField}
                  keyboardType="email-address"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            {/* IMPORTANT: Show the error message */}
            {errors['email'] && (
              <Text style={AuthStyles.errorMsg}>{errors['email'].message}</Text>
            )}
          </View>

          <View style={AuthStyles.field}>
            <Text style={AuthStyles.label}>Password</Text>
            <Controller
              name="password"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.ash}
                  style={AuthStyles.inputField}
                  keyboardType="email-address"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {/* IMPORTANT: Show the error message */}
            {errors['password'] && (
              <Text style={AuthStyles.errorMsg}>
                {errors['password'].message}
              </Text>
            )}
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <Btn text="Sign Up" action={handleSubmit(onSubmit)} />
        </View>

        <AltLoginView showFingerPrintOption={false} />
      </View>
    </LinearGradient>
  );
}

export default SignUpView;
