import BackHeader from '@/src/components/BackHeader';
import Btn from '@/src/components/Btn';
import { AuthStyles } from '@/src/components/SignInView';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { registerMobileSchema } from '@/src/schemas/basicFormSchema';
import { useValidateSignUpDetailsMutation } from '@/src/store/api/verificationApi';
import { useAppDispatch } from '@/src/store/hooks';
import { addUserMobile } from '@/src/store/slices/userSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput from '@perttu/react-native-phone-number-input';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [validateSignup, { isLoading: isValidating }] =
    useValidateSignUpDetailsMutation();

  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);

  // IMPORTANT: Creating the form handler
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      mobile: '',
    },
    resolver: yupResolver(registerMobileSchema),
    // NOTE: Schema is imported
  });

  const onSubmit = async (data: yup.InferType<typeof registerMobileSchema>) => {
    try {
      const res = await validateSignup({ phone: data.mobile });
      console.log(res);
      if (res.data?.canRegister === false) throw new Error();

      dispatch(addUserMobile(data.mobile));
      reset();
      router.navigate('/verification');
    } catch {
      showToast({
        type: 'error',
        position: 'top',
        title: 'Sign up error',
        message: 'This phone number is already linked to an email',
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
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

          <Controller
            control={control}
            name="mobile"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                placeholder="Enter your mobile"
                style={AuthStyles.inputField}
                placeholderTextColor={Colors.ash}
                inputMode="numeric"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />

          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="DM"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            withDarkTheme
            withShadow
            autoFocus
          />

          {errors['mobile'] && (
            <Text style={AuthStyles.errorMsg}>{errors['mobile'].message}</Text>
          )}
        </View>
      </View>

      <View style={{ marginTop: 60 }}>
        <Btn text="Send OTP" action={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  desc: {
    fontFamily: Fonts.regular,
    color: '#A7AFB7',
    fontSize: 14,
    lineHeight: 24,
  },
});
