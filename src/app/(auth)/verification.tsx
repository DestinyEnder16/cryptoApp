import BackHeader from '@/src/components/BackHeader';
import Btn from '@/src/components/Btn';
import NumInputField from '@/src/components/NumInputField';
import { AuthStyles } from '@/src/components/SignInView';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import {
  useOtpMutation,
  useOtpVerificationMutation,
  useSignupMutation,
} from '@/src/store/api/Api';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setAuth } from '@/src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const RESEND_INTERVAL = 30;

export default function Verification() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const mobile = useAppSelector((state) => state.user.mobile);
  const email = useAppSelector((state) => state.user.email);
  const name = useAppSelector((state) => state.user.name);
  const password = useAppSelector((state) => state.user.password);

  const [timer, setTimer] = useState(RESEND_INTERVAL);
  const [otp, setOtp] = useState('');
  const [retryNum, setRetryNum] = useState(0);

  const [getOtp, { error: otpError, isLoading }] = useOtpMutation();
  const [
    verifyOtp,
    { error: verificationError, isLoading: pendingVerification },
  ] = useOtpVerificationMutation();
  const [signup, { error: signUpError, isLoading: signingUp }] =
    useSignupMutation();

  const busy = isLoading || pendingVerification || signingUp;

  const resendOtp = useCallback(() => {
    setTimer(RESEND_INTERVAL);
    setRetryNum((n) => n + 1);
  }, []);

  useEffect(() => {
    async function requestOtp() {
      try {
        const result = await getOtp({ email }).unwrap();

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Your verification code',
            body: `Your code is ${result.demoCode}`,
          },
          trigger: null,
        });
      } catch (e) {
        console.log('otp error', e);
      }
    }
    requestOtp();
  }, [getOtp, email, retryNum]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  async function verify() {
    try {
      const result = await verifyOtp({ email, code: otp }).unwrap();
      if (!result.verified) return;

      const auth = await signup({
        email,
        fullName: name,
        password,
        phone: mobile,
      }).unwrap();
      dispatch(setAuth(auth));
      await AsyncStorage.setItem('token', auth.token);
      router.navigate('/success');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <BackHeader txt="Verification" marginBottom={40} />

      <Text style={AuthStyles.heading}>Enter your code</Text>

      <View style={styles.subheader}>
        <Text style={styles.desc}>Please type the code we sent to:</Text>
        <Text style={styles.info}>{mobile}</Text>
      </View>

      {signUpError ? (
        <Text style={[AuthStyles.errorMsg, styles.signupError]}>
          A user with this email already exists.
        </Text>
      ) : (
        <View style={styles.body}>
          {otpError ? (
            <View style={styles.otpErrorBlock}>
              <Text style={AuthStyles.errorMsg}>
                Error getting the OTP - retry.
              </Text>
              <ResendCode onPress={resendOtp} />
            </View>
          ) : busy ? (
            <ActivityIndicator size="large" color={Colors.green} />
          ) : (
            <NumInputField num={6} marginTop={50} onFill={setOtp} />
          )}

          {verificationError && (
            <Text style={AuthStyles.errorMsg}>Invalid or expired code</Text>
          )}

          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={styles.desc}>Resend Code ({timer})</Text>
            ) : (
              !otpError && <ResendCode onPress={resendOtp} />
            )}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        {signUpError ? (
          <Btn text="Log In" action={() => router.replace('/(auth)/auth')} />
        ) : (
          <Btn text="Continue" action={() => otp.length === 6 && verify()} />
        )}
      </View>
    </View>
  );
}

function ResendCode({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.info}>Resend Code</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  subheader: {
    marginTop: 20,
    gap: 5,
  },
  body: {
    alignItems: 'center',
    gap: 20,
  },
  otpErrorBlock: {
    alignItems: 'center',
    gap: 10,
    marginTop: 50,
  },
  resendRow: {
    alignItems: 'center',
    gap: 5,
  },
  signupError: {
    textAlign: 'center',
    marginTop: 15,
  },
  footer: {
    marginTop: 60,
  },
  desc: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  info: {
    color: Colors.green,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
