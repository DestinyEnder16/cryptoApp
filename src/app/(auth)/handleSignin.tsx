import AppBackground from '@/src/components/AppBackground';
import { LoadingIcon } from '@/src/components/LoadingSpinner';
import { useLoginMutation } from '@/src/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setAuth } from '@/src/store/slices/authSlice';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';

export default function HandleSignin() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.user.email);
  const password = useAppSelector((state) => state.user.password);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function attemptSignIn() {
      if (!email || !password) {
        console.log('handleSignin: missing credentials', {
          hasEmail: !!email,
          hasPassword: !!password,
        });
        return;
      }
      try {
        const result = await login({ email, password }).unwrap();
        dispatch(setAuth(result));
        router.replace('/home');
      } catch (err) {
        console.log('handleSignin: login failed', err);
      }
    }
    attemptSignIn();
  }, [email, login, password, dispatch]);

  return (
    <AppBackground>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 50,
          paddingHorizontal: 20,
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
