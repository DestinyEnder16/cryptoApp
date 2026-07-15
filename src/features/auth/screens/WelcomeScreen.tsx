import AppBackground from '@/src/shared/components/AppBackground';
import AppKeyboardScrollView from '@/src/shared/components/AppKeyboardScrollView';
import LoginTemplate from '@/src/features/auth/components/LoginTemplate';
import ProfileAvatar from '@/src/features/profile/components/ProfileAvatar';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { showToast } from '@/src/shared/helpers/showToast';
import { signOut } from '@/src/features/auth/services/auth';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '@/src/features/auth/services/biometricAuth';
import { saveRefreshToken } from '@/src/features/auth/services/nativeKeychain';
import { setSignedOut } from '@/src/features/auth/services/sessionFlags';
import { useLoginMutation } from '@/src/features/auth/store/authApi';
import { useFetchMeQuery } from '@/src/features/profile/store/profileApi';
import { useAppDispatch } from '@/src/store/hooks';
import { setRefreshToken, setToken } from '@/src/features/auth/store/authSlice';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface BtnProps {
  text: string;
  bgColor: string;
  txtColor: string;
  onClick: () => void;
  disabled?: boolean;
}

function Btn({ text, bgColor, txtColor, onClick, disabled = false }: BtnProps) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor,
        borderRadius: 14,
        alignItems: 'center',
        paddingVertical: 20,
      }}
      activeOpacity={0.7}
      onPress={onClick}
      disabled={disabled}
    >
      <Text style={{ color: txtColor, fontFamily: Fonts.medium }}>{text}</Text>
    </TouchableOpacity>
  );
}

export default function WelcomeScreen() {
  const { data: user } = useFetchMeQuery();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [hasSavedBiometrics, setHasSavedBiometrics] = useState(false);

  useEffect(() => {
    async function checkBiometrics() {
      const available = await isBiometricAvailable();
      setHasSavedBiometrics(available);
    }
    checkBiometrics();
  }, []);

  if (!user) return null;

  const handleLogin = async () => {
    try {
      if (password.length === 0)
        throw new Error('Password field must be filled');

      // Re-authenticate with the password only — no OTP. The account already
      // lives on this device; a correct password (or 2FA, if the user enabled
      // it) is enough to restore access.
      const result = await login({
        loginType: 'email',
        identifier: user.email,
        password,
      }).unwrap();

      setPassword('');

      if ('requiresTwoFactor' in result) {
        router.replace({
          pathname: '/verify-2fa',
          params: { challengeId: result.challengeId },
        });
        return;
      }

      dispatch(setToken(result.accessToken));
      dispatch(setRefreshToken(result.refreshToken));
      await saveRefreshToken(result.refreshToken);
      // Re-entered successfully — clear the signed-out marker so the next
      // launch goes straight home.
      await setSignedOut(false);
      router.replace('/home');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Incorrect password. Please try again.';
      showToast({ type: 'error', title: 'Login failed', message });
    }
  };

  const handleAuth = async () => {
    try {
      const passed = await authenticateWithBiometrics();
      if (!passed) throw new Error();
      // Biometric proves ownership and the stored session is still valid, so
      // go straight in — no password, no OTP.
      await setSignedOut(false);
      router.replace('/home');
    } catch {
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: 'Error authenticating via biometrics',
      });
    }
  };

  const handleDifferentAccount = async () => {
    // Genuinely switching accounts: wipe the stored session so the next user
    // signs in from a clean slate.
    await signOut(dispatch);
    router.replace('/(auth)/auth');
  };

  return (
    <AppBackground>
      <LoginTemplate headerTxt="Welcome Back">
        <AppKeyboardScrollView>
        <View style={{ alignItems: 'center', gap: 20 }}>
          <ProfileAvatar name={user.fullName} style={{ marginTop: 30 }} />
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.desc}>
            Use password or Face ID approved on this device.
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View style={styles.passwordField}>
            <Text style={styles.passwordLabel}>Password</Text>
            <TextInput
              style={styles.passwordInput}
              placeholderTextColor={Colors.grey}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>

          <View style={{ gap: 15 }}>
            <Btn
              text={isLoading ? 'Logging in...' : 'Log in'}
              bgColor={Colors.green}
              txtColor={Colors.dark}
              onClick={() => handleLogin()}
              disabled={isLoading}
            />
            {hasSavedBiometrics && (
              <Btn
                text="Use Biometrics"
                bgColor={Colors.secondaryBackgroundColor}
                txtColor={Colors.text}
                onClick={() => handleAuth()}
              />
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignSelf: 'center',
            marginTop: 100,
          }}
        >
          <Text style={{ fontFamily: Fonts.regular, color: Colors.text }}>
            Not you?
          </Text>
          <Pressable onPress={handleDifferentAccount}>
            <Text style={{ fontFamily: Fonts.regular, color: Colors.green }}>
              Sign in with a different account
            </Text>
          </Pressable>
        </View>
        </AppKeyboardScrollView>
      </LoginTemplate>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  name: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.text,
  },
  desc: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
  },
  passwordField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 70,
    marginBottom: 40,
  },
  passwordLabel: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginBottom: 4,
  },
  passwordInput: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    padding: 0,
  },
});
