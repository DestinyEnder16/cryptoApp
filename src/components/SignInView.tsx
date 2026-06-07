import { yupResolver } from '@hookform/resolvers/yup';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import * as yup from 'yup';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';
import { showToast } from '../helpers/showToast';
import { setCredentials } from '../services/nativeKeychain';
import { useLoginMutation } from '../store/api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setToken } from '../store/slices/authSlice';
import {
  addUserEmail,
  addUserMobile,
  addUserPassword,
} from '../store/slices/userSlice';
import AltLoginView from './AltLoginView';
import AuthMethod from './AuthMethod';
import Btn from './Btn';

type Mode = 'email' | 'mobile';

interface AuthProps {
  showFingerprintIcon?: boolean;
}

function SignInView({ showFingerprintIcon = true }: AuthProps) {
  const { width } = useWindowDimensions();
  const [mode, setMode] = useState<Mode>('email');
  const dispatch = useAppDispatch();
  const [login, { isLoading, error: fetchError }] = useLoginMutation();

  const schema = yup.object({
    email:
      mode === 'email'
        ? yup
            .string()
            .required('Email is required')
            .email('Enter a valid email address')
        : yup.string(),
    mobile:
      mode === 'mobile'
        ? yup
            .string()
            .required('Mobile number is required')
            .matches(/^\+?\d{7,15}$/, 'Enter a valid mobile number')
        : yup.string(),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Must be at least 8 characters'),
  });

  // handles the form
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
      mobile: '',
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    if (mode === 'email' && data.email) {
      dispatch(addUserEmail(data.email));
    } else if (mode === 'mobile' && data.mobile) {
      dispatch(addUserMobile(data.mobile));
    }
    if (data.password) dispatch(addUserPassword(data.password));

    try {
      const result = await login({
        loginType: mode === 'email' ? 'email' : 'phone',
        identifier: (mode === 'email' ? data.email : data.mobile)!,
        password: data.password,
      }).unwrap();

      if ('requiresTwoFactor' in result) {
        reset();
        router.replace({
          pathname: '/verify-2fa',
          params: { challengeId: result.challengeId },
        });
        return;
      }

      dispatch(setToken(result.accessToken));

      setCredentials({ email: data.email, token: result.accessToken });
      showToast({
        type: 'success',
        title: 'Success',
        message: 'You have been signed in successfully.',
      });

      reset();

      router.replace('/home');
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Invalid credentials. Please try again.',
      });
    }
  };

  const modeErrorMsg = errors[mode]?.message;
  useEffect(() => {
    if (modeErrorMsg)
      showToast({ type: 'error', title: 'Error', message: modeErrorMsg });
  }, [modeErrorMsg, mode]);

  return (
    <LinearGradient
      colors={[Colors.primaryBackgroundColor, Colors.secondaryBackgroundColor]}
      style={{ flex: 1 }}
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
                  onPress={() => setMode('mobile')}
                />
              ) : (
                <AuthMethod
                  label="Mobile Number"
                  instruction="Sign in with email"
                  onPress={() => setMode('email')}
                />
              )}
            </View>

            <Controller
              name={mode}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder={`Enter your ${mode}`}
                  placeholderTextColor={Colors.ash}
                  style={[
                    AuthStyles.inputField,
                    isLoading && { color: Colors.ash },
                  ]}
                  keyboardType={
                    mode === 'email' ? 'email-address' : 'phone-pad'
                  }
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  editable={!isLoading}
                />
              )}
            />
          </View>

          <View style={AuthStyles.field}>
            <Text style={AuthStyles.label}>Password</Text>

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.ash}
                  style={[
                    AuthStyles.inputField,
                    isLoading && { color: Colors.ash },
                  ]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  editable={!isLoading}
                />
              )}
            />

            {errors.password && (
              <Text style={AuthStyles.errorMsg}>{errors.password.message}</Text>
            )}

            {fetchError &&
              'status' in fetchError &&
              (fetchError.status === 'FETCH_ERROR' ||
                fetchError.status === 'TIMEOUT_ERROR') && (
                <Text style={AuthStyles.errorMsg}>
                  Network error. Check your internet connection and try again
                </Text>
              )}

            <Text style={{ color: Colors.green, fontFamily: Fonts.regular }}>
              Forgot password?
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <Btn
            text="Sign In"
            action={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </View>

        <AltLoginView showFingerPrintOption={showFingerprintIcon} />
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
    color: Colors.text,
  },
  errorMsg: {
    fontFamily: Fonts.medium,
    color: Colors.error,
  },
});

export default SignInView;
