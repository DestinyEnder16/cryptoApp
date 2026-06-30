import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatAmount } from '@/src/helpers/formatAmount';
import { showToast } from '@/src/helpers/showToast';
import { useRequestWithdrawalMutation } from '@/src/store/api/walletApi';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Row } from './WithdrawalSubmittedScreen';

export default function ConfirmWithdrawalScreen() {
  const params = useLocalSearchParams<{
    amount?: string;
    address?: string;
    asset?: string;
    network?: string;
  }>();

  const symbol = params.asset ?? 'USDT';
  const amount = params.amount ?? '0.00';
  const address = params.address ?? '—';
  const network = params.network ?? '—';
  const numericAmount = parseFloat(amount) || 0;

  const [pin, setPin] = useState('');
  const [requestWithdrawal, { isLoading }] = useRequestWithdrawalMutation();

  const submit = async () => {
    try {
      const wd = await requestWithdrawal({
        assetSymbol: symbol,
        amount: numericAmount,
        address,
        network,
        pin,
      }).unwrap();

      router.navigate(
        `/wallet/withdraw/submitted?amount=${encodeURIComponent(
          formatAmount(wd.amount)
        )}&asset=${wd.assetSymbol}&fee=${encodeURIComponent(
          formatAmount(wd.feeAssetAmount)
        )}&reference=${encodeURIComponent(wd.id)}&createdAt=${encodeURIComponent(
          wd.createdAt
        )}`
      );
    } catch {
      showToast({
        type: 'error',
        title: 'Withdrawal failed',
        message: 'Could not submit your withdrawal. Please try again.',
      });
    }
  };

  return (
    <AppBackground>
      <ScreenIntro
        title="Confirm withdrawal"
        description="Review every detail before submitting."
        hasBackBtn
      />

      <AppKeyboardScrollView contentContainerStyle={{ paddingTop: 20, gap: 16 }}>
        <View style={styles.rows}>
          <Text style={styles.amount}>
            {amount} {symbol}
          </Text>

          <Row label="Asset" value={symbol} />
          <Row label="Network" value={network} />
          <Row label="Address" value={address} />
        </View>

        <View style={styles.pinBlock}>
          <Text style={styles.pinLabel}>Transaction PIN</Text>
          <TextInput
            value={pin}
            onChangeText={(text) =>
              setPin(text.replace(/[^0-9]/g, '').slice(0, 4))
            }
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            style={styles.pinInput}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Btn
            text="Submit withdrawal"
            fontSize={13}
            disabled={pin.length < 4 || isLoading}
            action={submit}
          />
        </View>
      </AppKeyboardScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 34,
    textAlign: 'center',
    marginBottom: 8,
  },
  rows: {
    backgroundColor: '#141820',
    paddingHorizontal: 20,
    gap: 20,
    borderRadius: 14,
    paddingTop: 30,
    paddingBottom: 30,
    marginVertical: 20,
  },
  pinBlock: {
    backgroundColor: '#141820',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 14,
    marginTop: 8,
  },
  pinLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  pinInput: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
    letterSpacing: 6,
    marginTop: 10,
  },
});
