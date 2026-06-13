import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import Loader from '@/src/components/Loader';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { emailRule, nameRule } from '@/src/schemas/basicFormSchema';
import {
  useEditProfileMutation,
  useFetchMeQuery,
} from '@/src/store/api/profileApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as yup from 'yup';

const phoneRule = yup
  .string()
  .required('Enter a mobile number')
  .matches(
    /^\+[1-9]\d{7,14}$/,
    'Use international format (e.g. +2348012345678)'
  );

const profileFormSchema = yup.object({
  fullName: nameRule,
  email: emailRule,
  phone: phoneRule,
});

type ProfileFormValues = yup.InferType<typeof profileFormSchema>;

export default function Edit() {
  const { data: user, isLoading } = useFetchMeQuery();
  const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileFormValues>({
    mode: 'onChange',
    resolver: yupResolver(profileFormSchema),
    defaultValues: { fullName: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await editProfile(values).unwrap();
      showToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Your changes have been saved.',
      });
      router.back();
    } catch {
      showToast({
        type: 'error',
        title: 'Update failed',
        message: 'Could not save your changes. Try again.',
      });
    }
  };

  const canSubmit = isDirty && isValid && !isSaving;

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <ScreenIntro
            title="Edit profile"
            description="Update your name, email, and phone number."
            hasBackBtn
          />

          {isLoading || !user ? (
            <Loader />
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.avatarWrap}>
                <ProfileAvatar name={user.fullName} size={96} fontSize={36} />
                <Text style={styles.avatarHint}>
                  Avatar uploads coming soon
                </Text>
              </View>

              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Field
                    label="Full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.fullName?.message}
                    placeholder="Your name"
                    autoCapitalize="words"
                    editable={!isSaving}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { value } }) => (
                  <Field
                    label="Email"
                    value={value}
                    onChangeText={() => {}}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={false}
                    hint="Email changes not yet allowed"
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Field
                    label="Phone"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    placeholder="+2348012345678"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    editable={!isSaving}
                  />
                )}
              />
            </ScrollView>
          )}

          <View style={styles.footer}>
            <Btn
              text={isSaving ? 'Saving…' : 'Save changes'}
              action={handleSubmit(onSubmit)}
              disabled={!canSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
  hint?: string;
}

function Field({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  keyboardType = 'default',
  autoCapitalize,
  autoCorrect,
  editable = true,
  hint,
}: FieldProps) {
  return (
    <View>
      <View style={[styles.field, !editable && styles.fieldLocked]}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={Colors.ash}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          style={[styles.fieldInput, !editable && styles.fieldInputLocked]}
        />
      </View>
      {error ? (
        <Text style={styles.errorMsg}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintMsg}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scroll: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 16,
  },
  avatarWrap: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  avatarHint: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 12,
  },
  field: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  fieldLabel: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 12,
    marginBottom: 4,
  },
  fieldInput: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 16,
    padding: 0,
  },
  errorMsg: {
    fontFamily: Fonts.regular,
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  hintMsg: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  fieldLocked: {
    opacity: 0.65,
  },
  fieldInputLocked: {
    color: Colors.ash,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});
