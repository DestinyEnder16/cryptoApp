import AppKeyboardScrollView from "@/src/components/AppKeyboardScrollView";
import BackHeader from "@/src/components/BackHeader";
import Btn from "@/src/components/Btn";
import { AuthStyles } from "@/src/components/SignInView";
import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import { getUserRegion } from "@/src/helpers/getUserLocale";
import { showToast } from "@/src/helpers/showToast";
import { useSignupMutation } from "@/src/store/api/authApi";
import { useValidateSignUpDetailsMutation } from "@/src/store/api/verificationApi";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { addUserMobile } from "@/src/store/slices/userSlice";
import PhoneInput from "@perttu/react-native-phone-number-input";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [validateSignup, { isLoading: isValidating }] =
    useValidateSignUpDetailsMutation();

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  const [signup, { error: signUpError, isLoading: signingUp }] =
    useSignupMutation();

  const phoneInput = useRef<PhoneInput>(null);

  function reset() {
    setValue("");
    setFormattedValue("");
  }

  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);

  const onSubmit = async () => {
    try {
      // IMPORTANT checking number validity
      const checkValid = phoneInput.current?.isValidNumber(value);
      if (!checkValid) throw new Error("Phone number is not valid");
      const res = await validateSignup({ phone: formattedValue });
      if (res.data?.canRegister === false)
        throw new Error("This number is already linked to an email");

      dispatch(addUserMobile(formattedValue));

      if (!user?.email || !user?.name || !user?.mobile) {
        throw new Error("Missing account details. Please restart sign up.");
      }

      // IMPORTANT creating an account
      const register = await signup({
        email: user?.email,
        password: user.password,
        fullName: user?.name,
        phone: formattedValue,
      });

      reset();
      if (register.data?.emailVerificationRequired) {
        router.navigate("/verification");
      } else {
        router.navigate("/handleSignin");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      showToast({
        type: "error",
        position: "top",
        title: "Sign up error",
        message,
      });
    }
  };

  return (
    <AppKeyboardScrollView
      contentContainerStyle={{ paddingTop: insets.top + 10 }}
    >
      <View style={styles.container}>
        <BackHeader txt="Sign Up" marginBottom={30} />

        <Text style={[AuthStyles.heading, { marginBottom: 10 }]}>
          Register with mobile
        </Text>

        <Text style={styles.desc}>
          Please type your number, then we’ll send a verification code for
          authentication.
        </Text>

        <View style={AuthStyles.formContainer}>
          <View style={AuthStyles.field}>
            <Text style={AuthStyles.label}>Mobile Number</Text>

            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode={getUserRegion()}
              layout="first"
              onChangeText={(text) => {
                setValue(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              containerStyle={{
                backgroundColor: Colors.secondaryBackgroundColor,
                borderRadius: 10,
              }}
              textContainerStyle={{
                backgroundColor: Colors.secondaryBackgroundColor,
                borderRadius: 10,
              }}
              textInputStyle={{ color: "white" }}
              codeTextStyle={{ color: "white" }}
              withDarkTheme
              autoFocus
            />
          </View>
        </View>

        <View style={{ marginTop: 60 }}>
          <Btn
            text={signingUp ? "Creating account..." : "Send OTP"}
            action={onSubmit}
            disabled={isValidating}
          />
        </View>
      </View>
    </AppKeyboardScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  desc: {
    fontFamily: Fonts.regular,
    color: "#A7AFB7",
    fontSize: 14,
    lineHeight: 24,
  },
});
