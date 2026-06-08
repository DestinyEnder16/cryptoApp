import { Fonts } from '@/src/constants/fonts';
import { EyeSlash } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import {
  disable2faSchema,
  type Disable2faFormValues,
} from '@/src/schemas/disable2faSchema';
import { useDisableTwoFactorMutation } from '@/src/store/api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ScreenIntro from './ScreenIntro';

export default function DisableAuth() {
  const [showPassword, setShowPassword] = useState(false);
  const [disableTwoFactor, { isLoading }] = useDisableTwoFactorMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Disable2faFormValues>({
    mode: 'onChange',
    defaultValues: { password: '', code: '' },
    resolver: yupResolver(disable2faSchema),
  });

  const onSubmit = async (data: Disable2faFormValues) => {
    try {
      await disableTwoFactor({
        password: data.password,
        code: data.code,
      }).unwrap();
      showToast({
        type: 'success',
        title: '2FA disabled',
        message: 'Two-factor authentication has been turned off.',
      });
      router.back();
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? 'Invalid password or code. Try again.'
          : 'Failed to disable 2FA';
      showToast({ type: 'error', title: '2FA error', message });
    }
  };

  const canSubmit = isValid && !isLoading;

  return (
    <View style={{ flex: 1 }}>
      <ScreenIntro
        title="Disable 2FA"
        description="Confirm your password and current authenticator code."
        hasBackBtn
      />

      <View style={styles.warningCard}>
        <View style={styles.warningIcon}>
          <Text style={styles.warningIconText}>!</Text>
        </View>
        <View style={styles.warningTextGroup}>
          <Text style={styles.cardHeader}>Security warning</Text>
          <Text style={styles.cardDesc}>
            Disabling 2FA makes sign-in less protected on new devices.
          </Text>
        </View>
      </View>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View style={styles.inputRow}>
              <View style={styles.inputPrefix}>
                <View style={styles.greenDot} />
              </View>
              <TextInput
                style={styles.inputField}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
                placeholderTextColor={Colors.ash}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <Pressable
                hitSlop={10}
                onPress={() => setShowPassword((v) => !v)}
                style={styles.inputSuffix}
              >
                <EyeSlash />
              </Pressable>
            </View>
            {errors.password && (
              <Text style={styles.errorMsg}>{errors.password.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View style={styles.inputRow}>
              <View style={styles.inputPrefix}>
                <Text style={styles.hashText}>#</Text>
              </View>
              <TextInput
                style={styles.inputField}
                value={value}
                onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 6))}
                onBlur={onBlur}
                placeholder="Authenticator code"
                placeholderTextColor={Colors.ash}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading}
              />
            </View>
            {errors.code && (
              <Text style={styles.errorMsg}>{errors.code.message}</Text>
            )}
          </>
        )}
      />

      <View style={styles.sureCard}>
        <Text style={styles.sureHeader}>Are you sure?</Text>
        <Text style={styles.cardDesc}>
          You can turn 2FA back on from Security Settings whenever you need it.
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <Pressable style={styles.keepBtn} onPress={() => router.back()}>
        <Text style={styles.keepBtnText}>Keep 2FA on</Text>
      </Pressable>

      <Pressable
        style={[styles.disableBtn, !canSubmit && { opacity: 0.6 }]}
        disabled={!canSubmit}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.disableBtnText}>
          {isLoading ? 'Disabling…' : 'Disable 2FA'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 64,
    marginBottom: 24,
  },
  warningIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconText: {
    color: Colors.orangeBrown,
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 22,
  },
  warningTextGroup: {
    flex: 1,
    gap: 6,
  },
  cardHeader: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  cardDesc: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    marginBottom: 14,
  },
  inputPrefix: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  hashText: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  inputField: {
    flex: 1,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 15,
    padding: 0,
  },
  inputSuffix: {
    paddingHorizontal: 4,
  },
  errorMsg: {
    color: Colors.error,
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 4,
  },
  sureCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 8,
    marginTop: 50,
  },
  sureHeader: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  keepBtn: {
    backgroundColor: Colors.green,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  keepBtnText: {
    color: Colors.dark,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  disableBtn: {
    backgroundColor: Colors.disabledRed,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  disableBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
});
