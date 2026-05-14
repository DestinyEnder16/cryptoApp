import BackHeader from "@/src/components/BackHeader";
import Btn from "@/src/components/Btn";
import NumInputField from "@/src/components/NumInputField";
import { AuthStyles } from "@/src/components/SignInView";
import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useOtpMutation,
  useOtpVerificationMutation,
  useSignupMutation,
} from "@/src/store/api/Api";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setAuth } from "@/src/store/slices/authSlice";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Verification() {
  const insets = useSafeAreaInsets();
  const mobile = useAppSelector((state) => state.user.mobile);
  const email = useAppSelector((state) => state.user.email);
  const name = useAppSelector((state) => state.user.name);
  const password = useAppSelector((state) => state.user.password);

  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState("");
  const [getOtp, { error, isLoading }] = useOtpMutation();
  const [retryNum, setRetryNum] = useState(0);
  const [
    verifyOtp,
    { error: verificationError, isLoading: pendingVerification },
  ] = useOtpVerificationMutation();
  const [signup, { error: signUpError, isLoading: signingUp }] =
    useSignupMutation();
  const dispatch = useAppDispatch();

  useEffect(
    function () {
      async function verify() {
        try {
          const result = await getOtp({ email }).unwrap();

          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== "granted") return;

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Your verification code",
              body: `Your code is ${result.demoCode}`,
            },
            trigger: null,
          });
        } catch (e) {
          console.log("otp error", e);
        }
      }
      verify();
    },
    [getOtp, email, retryNum],
  );

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  async function verify() {
    try {
      const result = await verifyOtp({ email, code: otp }).unwrap();
      if (!result.verified) return;

      const auth = await signup({
        email,
        fullName: name,
        password,
        phone: mobile,
      }).unwrap();
      dispatch(setAuth(auth));
      console.log(auth.token);
      await AsyncStorage.setItem("token", auth.token);
      router.navigate("/success");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <BackHeader txt="Verification" marginBottom={40} />

      <Text style={AuthStyles.heading}>Enter your code</Text>

      <View style={{ marginTop: 20, gap: 5 }}>
        <Text style={styles.desc}>Please type the code we sent to:</Text>
        <Text style={styles.info}>{email}</Text>
      </View>

      {signUpError ? (
        <Text
          style={[AuthStyles.errorMsg, { textAlign: "center", marginTop: 15 }]}
        >
          A user with this email already exists.
        </Text>
      ) : (
        <View style={{ alignItems: "center", gap: 20 }}>
          {error ? (
            <View style={{ alignItems: "center", gap: 10, marginTop: 50 }}>
              <Text style={AuthStyles.errorMsg}>
                Error getting the OTP - retry.
              </Text>
              <Pressable
                onPress={() => {
                  setTimer(30);
                  setRetryNum((n) => n + 1);
                }}
              >
                <Text style={styles.info}>Resend Code</Text>
              </Pressable>
            </View>
          ) : isLoading || pendingVerification || signingUp ? (
            <ActivityIndicator />
          ) : (
            <NumInputField num={6} marginTop={50} onFill={setOtp} />
          )}

          {verificationError && (
            <Text style={AuthStyles.errorMsg}>Invalid or expired code</Text>
          )}

          <View style={{ alignItems: "center", gap: 5 }}>
            {timer > 0 ? (
              <Text style={styles.desc}>Resend Code ({timer})</Text>
            ) : (
              <Pressable
                onPress={() => {
                  setTimer(30);
                  setRetryNum((n) => n + 1);
                }}
              >
                <Text style={styles.info}>Resend Code</Text>
              </Pressable>
            )}
            <Text style={styles.info}>Resend Link</Text>
          </View>
        </View>
      )}

      {signUpError ? (
        <View style={{ marginTop: 60 }}>
          <Btn text="Log In" action={() => router.replace("/(auth)/auth")} />
        </View>
      ) : (
        <View style={{ marginTop: 60 }}>
          <Btn text="Continue" action={() => otp.length === 6 && verify()} />
        </View>
      )}
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
