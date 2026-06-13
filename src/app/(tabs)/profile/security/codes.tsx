import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { EyeSlash } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import {
  disable2faSchema,
  type Disable2faFormValues,
} from '@/src/schemas/disable2faSchema';
import {
  useEnableTwoFactorMutation,
  useRegenerateCodesMutation,
} from '@/src/store/api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function Codes() {
  const [, { data: enableData }] = useEnableTwoFactorMutation({
    fixedCacheKey: 'enable-2fa',
  });
  const [regenerate, { data: regenerateData, isLoading }] =
    useRegenerateCodesMutation();

  const [showModal, setShowModal] = useState(false);

  const codes = regenerateData?.recoveryCodes ?? enableData?.recoveryCodes ?? [];

  return (
    <AppBackground>
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <ScreenIntro
          title="Recovery codes"
          description="Save these once. Each code can only be used one time."
        />

        <View style={styles.grid}>
          {codes.length === 0 ? (
            <Text style={styles.empty}>No recovery codes available.</Text>
          ) : (
            codes.map((code) => (
              <View key={code} style={styles.codeBox}>
                <Text style={styles.codeText}>{code}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          style={styles.regenBtn}
          onPress={() => setShowModal(true)}
          disabled={isLoading}
        >
          <Text style={styles.regenBtnText}>
            {isLoading ? 'Regenerating…' : 'Regenerate codes'}
          </Text>
        </Pressable>
      </View>

      <RegenerateModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async (values) => {
          try {
            await regenerate(values).unwrap();
            setShowModal(false);
            showToast({
              type: 'success',
              title: 'Codes regenerated',
              message: 'Save the new codes — old ones no longer work.',
            });
          } catch {
            showToast({
              type: 'error',
              title: 'Regeneration failed',
              message: 'Invalid password or code. Try again.',
            });
          }
        }}
        isLoading={isLoading}
      />
    </AppBackground>
  );
}

interface RegenerateModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (values: Disable2faFormValues) => void;
  isLoading: boolean;
}

function RegenerateModal({
  visible,
  onClose,
  onConfirm,
  isLoading,
}: RegenerateModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Disable2faFormValues>({
    mode: 'onChange',
    defaultValues: { password: '', code: '' },
    resolver: yupResolver(disable2faSchema),
  });

  const close = () => {
    reset();
    onClose();
  };

  const canSubmit = isValid && !isLoading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Confirm to regenerate</Text>
          <Text style={styles.modalDesc}>
            Old codes will stop working. Enter your password and an
            authenticator code to continue.
          </Text>

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
                    onChangeText={(t) =>
                      onChange(t.replace(/\D/g, '').slice(0, 6))
                    }
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

          <View style={styles.modalActions}>
            <Pressable
              style={styles.cancelBtn}
              onPress={close}
              disabled={isLoading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmBtn, !canSubmit && { opacity: 0.6 }]}
              disabled={!canSubmit}
              onPress={handleSubmit(onConfirm)}
            >
              <Text style={styles.confirmBtnText}>
                {isLoading ? 'Regenerating…' : 'Regenerate'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 30,
  },
  codeBox: {
    width: '48%',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  codeText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
    letterSpacing: 1,
  },
  empty: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
  },
  regenBtn: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  regenBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: Colors.primaryBackgroundColor,
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  modalDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Colors.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Colors.dark,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
});
