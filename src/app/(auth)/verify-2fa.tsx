import ActionBtn from '@/src/shared/components/ActionBtn';
import AppBackground from '@/src/shared/components/AppBackground';
import AppKeyboardScrollView from '@/src/shared/components/AppKeyboardScrollView';
import Btn from '@/src/shared/components/Btn';
import InfoField from '@/src/features/auth/components/InfoField';
import LoginTemplate from '@/src/features/auth/components/LoginTemplate';
import NumInputField from '@/src/features/auth/components/NumInputField';
import { Fonts } from '@/src/shared/constants/fonts';
import { AuthenticationIcon, CheckMarkIcon } from '@/src/shared/constants/images';
import { Colors } from '@/src/shared/constants/styles';
import { showToast } from '@/src/shared/helpers/showToast';
import { setCredentials } from '@/src/features/auth/services/nativeKeychain';
import { useVerifyTwoFactorMutation } from '@/src/features/auth/store/authApi';
import { useAppDispatch } from '@/src/store/hooks';
import { setRefreshToken, setToken } from '@/src/features/auth/store/authSlice';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

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
    !isLoading &&
    (mode === 'code' ? code.length === 6 : recoveryCode.length > 0);

  async function handleVerify() {
    if (!challengeId) return;
    try {
      const payload = await verifyTwoFactor(
        mode === 'code' ? { challengeId, code } : { challengeId, recoveryCode }
      ).unwrap();

      dispatch(setToken(payload.accessToken));
      dispatch(setRefreshToken(payload.refreshToken));
      await setCredentials({
        identifier: payload.user?.id,
        token: payload.accessToken,
        refreshToken: payload.refreshToken,
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
        hasBackBtn
        headerTxt="Two-factor authentication"
        headerDesc={
          mode === 'code'
            ? 'Enter the code from your authenticator app.'
            : 'Enter one of your recovery codes.'
        }
      >
        <AppKeyboardScrollView>
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: Colors.lime,
            borderRadius: 9999,
            padding: 25,
            marginVertical: 30,
          }}
        >
          <AuthenticationIcon />
        </View>

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
            text={isLoading ? 'Verifying…' : 'Continue'}
            action={handleVerify}
            disabled={!canSubmit}
          />

          <ActionBtn
            text={
              mode === 'code'
                ? 'Use a recovery code instead'
                : 'Use authenticator code instead'
            }
            action={() => setMode(mode === 'code' ? 'recovery' : 'code')}
            styles={{
              backgroundColor: Colors.secondaryBackgroundColor,
              txtColor: Colors.text,
            }}
            style={{ width: '100%' }}
          />
        </View>

        <View style={{ alignSelf: 'center', marginTop: 50 }}>
          <InfoField
            icon={CheckMarkIcon}
            header="Protected account"
            desc="This extra step protects your trading balance and saved devices."
          />
        </View>
        </AppKeyboardScrollView>
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
    marginTop: 50,
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
  authIcon: {
    height: 32,
  },
});
