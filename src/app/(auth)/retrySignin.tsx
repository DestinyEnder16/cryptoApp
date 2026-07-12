import ActionBtn from '@/src/components/ActionBtn';
import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { setCredentials } from '@/src/services/nativeKeychain';
import { useLoginMutation } from '@/src/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setRefreshToken, setToken } from '@/src/store/slices/authSlice';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RetrySignin() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const storedEmail = useAppSelector((state) => state.user.email);
  const storedMobile = useAppSelector((state) => state.user.mobile);
  const storedPassword = useAppSelector((state) => state.user.password);
  const [login, { isLoading }] = useLoginMutation();

  const [identifier, setIdentifier] = useState(storedEmail || storedMobile);
  const [password, setPassword] = useState(storedPassword);

  async function handleRetry() {
    if (!identifier || !password) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please fill in both fields.',
      });
      return;
    }
    const isEmail = identifier.includes('@');
    try {
      const result = await login({
        loginType: isEmail ? 'email' : 'phone',
        identifier,
        password,
      }).unwrap();
      if ('requiresTwoFactor' in result) {
        router.replace({
          pathname: '/verify-2fa',
          params: { challengeId: result.challengeId },
        });
        return;
      }
      dispatch(setToken(result.accessToken));
      dispatch(setRefreshToken(result.refreshToken));
      await setCredentials({
        identifier: result.user?.id,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      });
      router.replace('/home');
    } catch {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Invalid credentials. Please try again.',
      });
    }
  }

  return (
    <AppBackground>
      <AppKeyboardScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        <View style={styles.top}>
          <Text style={styles.heading}>Sign in failed</Text>

          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>Invalid login details</Text>
            <Text style={styles.alertDesc}>
              Check your email, phone number, or password and try again.
            </Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.label}>Email or phone</Text>
              <TextInput
                style={styles.input}
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                placeholderTextColor={Colors.ash}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                placeholderTextColor={Colors.ash}
              />
            </View>
          </View>
        </View>

        <ActionBtn
          styles={{ backgroundColor: Colors.green, txtColor: Colors.dark }}
          text={isLoading ? 'Signing in...' : 'Try again'}
          action={handleRetry}
        />
      </AppKeyboardScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    gap: 30,
  },
  heading: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  alertCard: {
    backgroundColor: '#3A2A12',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  alertTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  alertDesc: {
    color: '#C9A37A',
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  fields: {
    gap: 16,
  },
  field: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 2,
  },
  label: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  input: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    padding: 0,
  },
});
