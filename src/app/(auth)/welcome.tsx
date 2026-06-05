import AppBackground from '@/src/components/AppBackground';
import LoginTemplate from '@/src/components/LoginTemplate';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '@/src/services/biometricAuth';
import { useLoginMutation } from '@/src/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectUser } from '@/src/store/slices/authSlice';
import { addUserEmail, addUserPassword } from '@/src/store/slices/userSlice';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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

export default function Welcome() {
  const user = useAppSelector(selectUser);
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

  const handleSignup = async () => {
    try {
      if (password.length === 0) throw new Error();
      // Verify credentials only. The session returned here is discarded —
      // HandleSignin re-logs in after OTP to establish the real session.
      await login({ email: user.email, password }).unwrap();

      dispatch(addUserEmail(user.email));
      dispatch(addUserPassword(password));

      setPassword('');
      router.replace('/verify-otp');
    } catch (err) {
      console.log('login failed', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Invalid credentials. Please try again.',
      });
    }
  };

  const handleAuth = async () => {
    try {
      const res = await authenticateWithBiometrics();
      if (!res) throw new Error(); // or show an error
      // navigate
      if (res) router.navigate('/verify-otp');
    } catch {
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: 'Error authenticating via biometrics',
      });
    }
  };

  return (
    <AppBackground>
      <LoginTemplate headerTxt="Welcome Back">
        <View style={{ alignItems: 'center', gap: 20 }}>
          <View style={styles.profile}>
            <Text style={styles.profileInitial}>{user.fullName.charAt(0)}</Text>
          </View>
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
              secureTextEntry
              placeholderTextColor={Colors.grey}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>

          <View style={{ gap: 15 }}>
            <Btn
              text={isLoading ? 'Signing up...' : 'Sign Up'}
              bgColor={Colors.green}
              txtColor={Colors.dark}
              onClick={() => handleSignup()}
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
      </LoginTemplate>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: Colors.green,
    width: 122,
    height: 122,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 30,
  },
  profileInitial: {
    fontFamily: Fonts.bold,
    fontSize: 42,
  },
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
