import AppBackground from '@/src/components/AppBackground';
import { LoadingIcon } from '@/src/components/LoadingSpinner';
import { useLoginMutation } from '@/src/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { saveRefreshToken } from '@/src/services/nativeKeychain';
import { setRefreshToken, setToken } from '@/src/store/slices/authSlice';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';

export default function HandleSignin() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.user.email);
  const mobile = useAppSelector((state) => state.user.mobile);
  const password = useAppSelector((state) => state.user.password);

  useEffect(() => {
    async function attemptSignIn() {
      const identifier = email || mobile;
      // Biometric flow: no creds are stashed in the slice because the user
      // didn't type a password. The keychain token has already been validated
      // by /me during bootstrap, so just go to /home.
      if (!identifier || !password) {
        router.replace('/home');
        return;
      }
      try {
        const result = await login({
          loginType: email ? 'email' : 'phone',
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
        await saveRefreshToken(result.refreshToken);
        router.replace('/home');
      } catch (err) {
        router.replace('/retrySignin');
      }
    }
    attemptSignIn();
  }, [email, mobile, login, password, dispatch]);

  return (
    <AppBackground>
      <View
        style={{
          flex: 1,
          paddingBottom: 80,
          gap: 300,
        }}
      >
        <View>
          <Text style={styles.txt}>Signing you in</Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          {isLoading && <LoadingIcon size={64} />}
        </View>
        <View>
          <Text style={styles.info}>
            Checking credentials and security settings...
          </Text>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  txt: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: Fonts.bold,
  },
  info: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 12,
    textAlign: 'center',
  },
});
