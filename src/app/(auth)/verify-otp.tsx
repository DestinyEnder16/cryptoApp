import LoginTemplate from '@/src/components/LoginTemplate';
import { Colors } from '@/src/constants/styles';

import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import NumInputField from '@/src/components/NumInputField';
import { showToast } from '@/src/helpers/showToast';
import {
  useOtpMutation,
  useOtpVerificationMutation,
} from '@/src/store/api/verificationApi';
import { useAppSelector } from '@/src/store/hooks';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  inputField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderColor: Colors.secondaryBackgroundColor,
  },
});

// Persists across mounts so back-navigating into this screen doesn't
// resend an OTP for an email we've already requested one for this session.
const otpRequestedFor = new Set<string>();

export default function VerifyOtp() {
  const num = 6;
  const [otp, setOtp] = useState('');

  const [getOtp, { error: otpError, isLoading, isSuccess }] = useOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useOtpVerificationMutation();

  // Runs on mount and again whenever retryNum changes (i.e. the user resends).

  const email = useAppSelector((state) => state.auth.user?.email!);

  useEffect(() => {
    // SOLUTION: Guard clause to ensure that emails that have requested OTP do not get a new one except when re-requested
    if (otpRequestedFor.has(email)) return;
    otpRequestedFor.add(email);

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
      } catch {
        otpRequestedFor.delete(email);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Otp could not be retrieved',
        });
      }
    }
    requestOtp();
  }, [getOtp, email]);

  async function handleVerification() {
    try {
      if (otp.length < 6) throw new Error('Kindly fill out the fields');
      const result = await verifyOtp({ email, code: otp }).unwrap();
      // Server returned 200 but the code didn't match — bail without signing up.
      if (!result.verified) throw new Error('Invalid OTP');
      // The verify endpoint returns no session token. HandleSignin runs the
      // login mutation and stores the resulting token in the keychain.
      router.replace('/handleSignin');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Check the code sent and try again';
      console.log(message);
      showToast({
        type: 'error',
        title: 'OTP Error',
        message,
      });
    }
  }

  return (
    <AppBackground>
      <LoginTemplate
        headerTxt="Verify OTP"
        headerDesc="Enter the six digit code we sent to your email"
      >
        <NumInputField
          num={num}
          marginTop={50}
          onFill={setOtp}
          isDisabled={!isSuccess}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 100,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          {isSuccess && (
            <Btn
              text={isVerifying ? 'Processing...' : 'Continue'}
              disabled={isLoading}
              action={() => handleVerification()}
            />
          )}
        </View>
      </LoginTemplate>
    </AppBackground>
  );
}
