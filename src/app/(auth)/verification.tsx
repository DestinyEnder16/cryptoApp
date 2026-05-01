import BackHeader from '@/src/components/BackHeader';
import Btn from '@/src/components/Btn';
import NumInputField from '@/src/components/NumInputField';
import { AuthStyles } from '@/src/components/SignInView';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useAppSelector } from '@/src/store/hooks';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Verification() {
  const insets = useSafeAreaInsets();
  const mobile = useAppSelector((state) => state.user.mobile);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <BackHeader txt="Verification" marginBottom={40} />

      <Text style={AuthStyles.heading}>Enter your code</Text>

      <View style={{ marginTop: 20, gap: 5 }}>
        <Text style={styles.desc}>Please type the code we sent to:</Text>
        <Text style={styles.info}>{mobile}</Text>
      </View>

      <View style={{ alignItems: 'center', gap: 20 }}>
        <NumInputField num={4} marginTop={50} onFill={setOtp} />

        <View style={{ alignItems: 'center', gap: 5 }}>
          {timer > 0 ? (
            <Text style={styles.desc}>Resend Code ({timer})</Text>
          ) : (
            <Pressable onPress={() => setTimer(30)}>
              <Text style={styles.info}>Resend Code</Text>
            </Pressable>
          )}
          <Text style={styles.info}>Resend Link</Text>
        </View>
      </View>

      <View style={{ marginTop: 60 }}>
        <Btn
          text="Continue"
          action={() => otp.length === 4 && router.navigate('/success')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  desc: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  info: {
    color: Colors.green,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
