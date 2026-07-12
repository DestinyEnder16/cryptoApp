import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletField from '@/src/components/wallet/WalletField';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatAmount } from '@/src/helpers/formatAmount';
import { gt, isPositive } from '@/src/helpers/money';
import { useGetWalletQuery } from '@/src/store/api/walletApi';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SendScreen() {
  const { data: wallet } = useGetWalletQuery();

  const balances = wallet?.wallet.balances ?? [];
  const [selectedSymbol, setSelectedSymbol] = useState(
    balances[0]?.assetSymbol ?? 'USDT'
  );
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);

  const selectedBalance = balances.find((b) => b.assetSymbol === selectedSymbol);
  const available = selectedBalance
    ? `${formatAmount(selectedBalance.available)} ${selectedSymbol}`
    : '—';

  // Decimal-safe: don't let a valid-looking amount over the balance through,
  // and don't reject an exact-balance send to a float-rounding artifact.
  const overBalance = selectedBalance
    ? gt(amount, selectedBalance.available)
    : true;
  const canContinue =
    recipient.trim().length > 0 && isPositive(amount) && !overBalance;

  return (
    <AppBackground>
      <ScreenIntro
        title="Send"
        description="Transfer assets to another user by email, phone, ID, or deposit address."
        hasBackBtn
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <AppKeyboardScrollView contentContainerStyle={styles.form}>
          {/* Asset picker */}
          <WalletField
            label="Asset"
            value={`${selectedSymbol} · Available ${available}`}
            onPress={() => setAssetPickerOpen((v) => !v)}
          />

          {assetPickerOpen && balances.length > 1 && (
            <View style={styles.pickerList}>
              {balances.map((b) => (
                <Pressable
                  key={b.assetSymbol}
                  style={[
                    styles.pickerItem,
                    b.assetSymbol === selectedSymbol && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setSelectedSymbol(b.assetSymbol);
                    setAssetPickerOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      b.assetSymbol === selectedSymbol &&
                        styles.pickerItemTextActive,
                    ]}
                  >
                    {b.assetSymbol}
                  </Text>
                  <Text style={styles.pickerItemSub}>
                    {formatAmount(b.available)} available
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Recipient */}
          <WalletField label="Recipient">
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="email-address"
              placeholder="Email, phone, user ID, or address"
              placeholderTextColor={Colors.textMuted}
            />
          </WalletField>

          {/* Amount */}
          <WalletField label={`Amount (${selectedSymbol})`}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
            />
          </WalletField>

          <View style={styles.note}>
            <Text style={styles.noteText}>
              Requires your transaction PIN. Recipient must be a registered user.
            </Text>
          </View>
        </AppKeyboardScrollView>

        <View style={{ paddingBottom: 8 }}>
          <Btn
            text="Preview transfer"
            fontSize={13}
            disabled={!canContinue}
            action={() =>
              router.navigate({
                pathname: '/wallet/send/confirm',
                params: {
                  assetSymbol: selectedSymbol,
                  amount,
                  recipient: recipient.trim(),
                },
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: 20,
    gap: 14,
  },
  input: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    padding: 0,
  },
  pickerList: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  pickerItemActive: {
    backgroundColor: Colors.lime,
  },
  pickerItemText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  pickerItemTextActive: {
    color: Colors.green,
  },
  pickerItemSub: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  note: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  noteText: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
