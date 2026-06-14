import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { useUpdateTransactionPinMutation } from '@/src/store/api/authApi';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const PIN_LENGTH = 4;

export default function Pin() {
  const [updatePin, { isLoading }] = useUpdateTransactionPinMutation();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const allFilled =
    currentPin.length === PIN_LENGTH &&
    newPin.length === PIN_LENGTH &&
    confirmPin.length === PIN_LENGTH;
  const canSubmit = allFilled && !isLoading;

  async function handleUpdate() {
    if (newPin !== confirmPin) {
      showToast({
        type: 'error',
        title: 'PINs do not match',
        message: 'The new PIN and confirmation must be identical.',
      });
      return;
    }
    if (newPin === currentPin) {
      showToast({
        type: 'error',
        title: 'Choose a new PIN',
        message: 'The new PIN must differ from the current one.',
      });
      return;
    }

    try {
      await updatePin({ currentPin, newPin }).unwrap();
      showToast({
        type: 'success',
        title: 'PIN updated',
        message: 'Your transaction PIN has been changed.',
      });
      router.back();
    } catch {
      showToast({
        type: 'error',
        title: 'Update failed',
        message: 'Check your current PIN and try again.',
      });
    }
  }

  return (
    <AppBackground>
      <AppKeyboardScrollView>
        <View style={styles.container}>
          <ScreenIntro
            title="Transaction PIN"
            description="Update the PIN used for trade and withdrawal confirmations."
            hasBackBtn
          />

          <View style={styles.fields}>
            <PinField
              label="Current PIN"
              value={currentPin}
              onChange={setCurrentPin}
              editable={!isLoading}
              placeholder="0000"
            />
            <PinField
              label="New PIN"
              value={newPin}
              onChange={setNewPin}
              editable={!isLoading}
            />
            <PinField
              label="Confirm PIN"
              value={confirmPin}
              onChange={setConfirmPin}
              editable={!isLoading}
            />

            <View style={styles.rulesCard}>
              <Text style={styles.rulesTitle}>PIN rules</Text>
              <Text style={styles.rulesBody}>
                Use four digits. Avoid repeated or obvious numbers in production
                apps.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Btn
              text={isLoading ? 'Updating…' : 'Update PIN'}
              action={handleUpdate}
              disabled={!canSubmit}
            />
          </View>
        </View>
      </AppKeyboardScrollView>
    </AppBackground>
  );
}

interface PinFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  editable?: boolean;
  placeholder?: string;
}

function PinField({
  label,
  value,
  onChange,
  editable = true,
  placeholder,
}: PinFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
        editable={editable}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={PIN_LENGTH}
        placeholder={placeholder}
        style={styles.fieldInput}
        placeholderTextColor={Colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fields: {
    flex: 1,
    marginTop: 24,
    gap: 12,
  },
  field: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  fieldLabel: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 12,
    marginBottom: 6,
  },
  fieldInput: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 20,
    padding: 0,
    letterSpacing: 8,
  },
  rulesCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 12,
    gap: 10,
  },
  rulesTitle: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 15,
  },
  rulesBody: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    paddingBottom: 16,
  },
});
