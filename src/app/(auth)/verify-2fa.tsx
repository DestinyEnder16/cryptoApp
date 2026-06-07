import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import LoginTemplate from '@/src/components/LoginTemplate';
import NumInputField from '@/src/components/NumInputField';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { setCredentials } from '@/src/services/nativeKeychain';
import { useVerifyTwoFactorMutation } from '@/src/store/api/authApi';
import { useAppDispatch } from '@/src/store/hooks';
import { setToken } from '@/src/store/slices/authSlice';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Mode = 'code' | 'recovery';

export default function VerifyTwoFactor() {
  const { challengeId } = useLocalSearchParams<{ challengeId?: string }>();
  const dispatch = useAppDispatch();
  const [verifyTwoFactor, { isLoading }] = useVerifyTwoFactorMutation();

  const [mode, setMode] = useState<Mode>('code');
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');

  if (!challengeId) {
    return (
      <AppBackground>
        <LoginTemplate
          headerTxt="Two-factor authentication"
          headerDesc="We couldn't find an active sign-in challenge."
        >
          <View style={{ marginTop: 60 }}>
            <Btn
              text="Back to sign in"
              action={() => router.replace('/(auth)/auth')}
            />
          </View>
        </LoginTemplate>
      </AppBackground>
    );
  }

  const canSubmit =
    !isLoading && (mode === 'code' ? code.length === 6 : recoveryCode.length > 0);

  async function handleVerify() {
    if (!challengeId) return;
    try {
      const payload = await verifyTwoFactor(
        mode === 'code'
          ? { challengeId, code }
          : { challengeId, recoveryCode }
      ).unwrap();

      dispatch(setToken(payload.accessToken));
      await setCredentials({
        email: payload.user.email,
        token: payload.accessToken,
      });
      router.replace('/home');
    } catch {
      showToast({
        type: 'error',
        title: '2FA error',
        message: 'Invalid code. Try again.',
      });
    }
  }

  return (
    <AppBackground>
      <LoginTemplate
        headerTxt="Two-factor authentication"
        headerDesc={
          mode === 'code'
            ? 'Enter the 6-digit code from your authenticator app.'
            : 'Enter one of your recovery codes.'
        }
      >
        {mode === 'code' ? (
          <NumInputField num={6} marginTop={50} onFill={setCode} />
        ) : (
          <View style={styles.recoveryField}>
            <Text style={styles.recoveryLabel}>Recovery code</Text>
            <TextInput
              style={styles.recoveryInput}
              value={recoveryCode}
              onChangeText={setRecoveryCode}
              placeholder="A1B2C-D3E4F"
              placeholderTextColor={Colors.grey}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
        )}

        <View style={styles.actions}>
          <Btn
            text={isLoading ? 'Verifying…' : 'Verify'}
            action={handleVerify}
            disabled={!canSubmit}
          />

          <Pressable
            onPress={() => setMode(mode === 'code' ? 'recovery' : 'code')}
            hitSlop={10}
          >
            <Text style={styles.toggle}>
              {mode === 'code'
                ? 'Use a recovery code instead'
                : 'Use authenticator code instead'}
            </Text>
          </Pressable>
        </View>
      </LoginTemplate>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  recoveryField: {
    marginTop: 50,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recoveryLabel: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 12,
    marginBottom: 4,
  },
  recoveryInput: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    padding: 0,
    letterSpacing: 1,
  },
  actions: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
    alignItems: 'center',
  },
  toggle: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
