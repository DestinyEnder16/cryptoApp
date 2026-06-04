import LoginTemplate from '@/src/components/LoginTemplate';
import { Colors } from '@/src/constants/styles';

import Btn from '@/src/components/Btn';
import NumInputField from '@/src/components/NumInputField';
import { showToast } from '@/src/helpers/showToast';
import { setCredentials } from '@/src/services/nativeKeychain';
import {
  useOtpMutation,
  useOtpVerificationMutation,
} from '@/src/store/api/verificationApi';
import { useAppSelector } from '@/src/store/hooks';
import * as Notifications from 'expo-notifications';
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
  const [verifyOtp] = useOtpVerificationMutation();

  // Runs on mount and again whenever retryNum changes (i.e. the user resends).

  const email = useAppSelector((state) => state.auth.user?.email!);

  useEffect(() => {
    // SOLUTION: Guard clause to ensure that emails that have requested OTP do not get a new one except when re-requested
    // if (otpRequestedFor.has(email)) return;
    // otpRequestedFor.add(email);

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
        // NOTE: otpRequestedFor.delete(email);
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
      const result = await verifyOtp({ email, code: otp }).unwrap();
      // Server returned 200 but the code didn't match — bail without signing up.
      //
      if (!result.verified) return;

      await setCredentials({ email, token: result.token });
    } catch {
      // Thrown failures surface via verificationError / signUpError in the UI.
    }
  }

  return (
    <LoginTemplate
      headerTxt="Verify OTP"
      headerDesc="Enter the six digit code we sent to your email"
    >
      <NumInputField num={num} marginTop={50} onFill={setOtp} />

      <View style={{ position: 'absolute', bottom: 100 }}>
        {isSuccess && (
          <Btn
            text="Continue"
            disabled={isLoading}
            action={() => handleVerification()}
          />
        )}
      </View>
    </LoginTemplate>
  );
}
