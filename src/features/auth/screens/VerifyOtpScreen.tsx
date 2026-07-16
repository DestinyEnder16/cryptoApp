import LoginTemplate from '@/src/features/auth/components/LoginTemplate';

import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import { LoadingIcon } from '@/src/shared/components/LoadingSpinner';
import NumInputField from '@/src/features/auth/components/NumInputField';
import { showToast } from '@/src/shared/helpers/showToast';
import { useFetchMeQuery } from '@/src/features/profile/store/profileApi';
import {
  useOtpMutation,
  useOtpVerificationMutation,
} from '@/src/features/auth/store/verificationApi';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

// Persists across mounts so back-navigating into this screen doesn't
// resend an OTP for an email we've already requested one for this session.
const otpRequestedFor = new Set<string>();

export default function VerifyOtpScreen() {
  const num = 6;
  const [otp, setOtp] = useState('');

  const [getOtp, { error: otpError, isLoading, isSuccess }] = useOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useOtpVerificationMutation();

  const { data: user } = useFetchMeQuery();
  const email = user?.email ?? '';
  const [requested, setRequested] = useState(() => otpRequestedFor.has(email));

  const requestOtp = useCallback(async () => {
    otpRequestedFor.add(email);
    setRequested(true);
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
      setRequested(false);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Otp could not be retrieved',
      });
    }
  }, [email, getOtp]);

  useEffect(() => {
    // Guard so emails that have already requested OTP don't get a new one
    // on remount — only when the user explicitly re-sends.
    if (otpRequestedFor.has(email)) return;
    requestOtp();
  }, [email, requestOtp]);

  function handleResend() {
    otpRequestedFor.delete(email);
    requestOtp();
  }

  async function handleVerification() {
    try {
      if (otp.length < 6) throw new Error('Kindly fill out the fields');
      const result = await verifyOtp({ email, code: otp }).unwrap();
      // Server returned 200 but the code didn't match — bail without signing up.
      if (otpError) throw new Error('Invalid OTP');
      // The verify endpoint returns no session token. HandleSignin runs the
      // login mutation and stores the resulting token in the keychain.
      if (result.verified) {
        router.replace('/handleSignin');
      }
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

        {isLoading && (
          <View style={{ alignSelf: 'center', marginTop: 200 }}>
            <LoadingIcon />
          </View>
        )}

        <View
          style={{
            position: 'absolute',
            bottom: 100,
            width: '100%',
            alignSelf: 'center',
            gap: 12,
          }}
        >
          {isSuccess && (
            <Btn
              text={isVerifying ? 'Processing...' : 'Continue'}
              disabled={isLoading || isVerifying}
              action={() => handleVerification()}
            />
          )}
          {requested && isSuccess && (
            <Btn
              text={isLoading ? 'Sending...' : 'Resend Code'}
              disabled={isLoading}
              action={handleResend}
            />
          )}
        </View>
      </LoginTemplate>
    </AppBackground>
  );
}
