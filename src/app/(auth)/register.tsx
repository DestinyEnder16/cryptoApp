import BackHeader from '@/src/components/BackHeader';
import Btn from '@/src/components/Btn';
import { AuthStyles } from '@/src/components/SignInView';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { registerMobileSchema } from '@/src/schemas/basicFormSchema';
import { useAppDispatch } from '@/src/store/hooks';
import { addUserMobile } from '@/src/store/slices/userSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

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

  const onSubmit = (data: yup.InferType<typeof registerMobileSchema>) => {
    dispatch(addUserMobile(data.mobile));
    reset();
    router.navigate('/verification');
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
                inputMode="email"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
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
