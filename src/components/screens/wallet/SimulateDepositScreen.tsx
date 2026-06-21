import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletField from '@/src/components/wallet/WalletField';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { SETTLEMENT_DELAYS } from '@/src/data/sandboxWallet';
import { showToast } from '@/src/helpers/showToast';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SimulateDepositScreen() {
  const { asset } = useLocalSearchParams<{ asset?: string }>();
  const symbol = asset ?? 'USDT';

  const [amount, setAmount] = useState('250.00');
  const [delay, setDelay] = useState(SETTLEMENT_DELAYS[0]);

  const previewAmount = amount.trim() === '' ? '0.00' : amount;

  const createDeposit = () => {
    showToast({
      type: 'success',
      title: 'Sandbox deposit created',
      message: `+${previewAmount} ${symbol} will settle in ${delay.label}.`,
    });
    router.dismissTo('/wallet/main');
  };

  return (
    <AppBackground>
      <ScreenIntro
        title="Simulate deposit"
        description="Create a pending USDT deposit for testing posting and receipts."
        hasBackBtn
      />

      <AppKeyboardScrollView contentContainerStyle={{ paddingTop: 20, gap: 16 }}>
        <WalletField label="Asset" value={symbol} />

        <WalletField label="Amount">
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
          />
        </WalletField>

        <WalletField label="Settlement delay">
          <View style={styles.chipRow}>
            {SETTLEMENT_DELAYS.map((option) => {
              const active = option.seconds === delay.seconds;
              return (
                <Pressable
                  key={option.seconds}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setDelay(option)}
                >
                  <Text
                    style={[styles.chipTxt, active && styles.chipTxtActive]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </WalletField>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Deposit preview</Text>
          <Text style={styles.previewAmount}>
            +{previewAmount} {symbol}
          </Text>
          <Text style={styles.previewNote}>
            Status starts as pending, then completes automatically.
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Btn
            text="Create sandbox deposit"
            fontSize={13}
            action={createDeposit}
          />
        </View>
      </AppKeyboardScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    padding: 0,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  chipActive: {
    backgroundColor: Colors.green,
  },
  chipTxt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  chipTxtActive: {
    color: Colors.dark,
  },
  preview: {
    backgroundColor: Colors.lime,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  previewLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  previewAmount: {
    color: Colors.green,
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  previewNote: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
});
