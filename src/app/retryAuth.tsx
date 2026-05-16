import Btn from '@/src/components/Btn';
import { Fonts } from '@/src/constants/fonts';
import { Fingerprint } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authenticateWithBiometrics } from '../services/biometricAuth';
import { cryptoApi } from '../store/api/Api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, setAuth } from '../store/slices/authSlice';

export default function RetryAuthScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  async function handleRetry() {
    try {
      const response = await authenticateWithBiometrics();
      if (token === null) throw new Error();
      if (response === false) throw new Error();
      try {
        const user = await dispatch(
          cryptoApi.endpoints.fetchMe.initiate()
        ).unwrap();
        dispatch(setAuth({ user, token }));
        router.replace('/(tabs)/home');
      } catch {
        await AsyncStorage.removeItem('token');
        dispatch(logout());
      }
    } catch {}
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.content}>
        <Pressable style={styles.iconWrapper} onPress={handleRetry}>
          <Fingerprint width={80} height={80} />
        </Pressable>

        <Text style={styles.heading}>Authentication Required</Text>
        <Text style={styles.desc}>
          We could not verify your identity. Please try again to continue.
        </Text>
      </View>

      <View style={styles.footer}>
        <Btn text="Try Again" action={handleRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.secondaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heading: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 22,
    textAlign: 'center',
  },
  desc: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  footer: {
    gap: 16,
    alignItems: 'center',
  },
  altBtn: {
    paddingVertical: 8,
  },
  altBtnTxt: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
