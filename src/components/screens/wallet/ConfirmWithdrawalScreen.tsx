import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { WITHDRAWAL_FEE_USDT } from '@/src/data/sandboxWallet';
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
  const network = params.network ?? 'TRC20';

  const [pin, setPin] = useState('');

  const numericAmount = parseFloat(amount) || 0;
  const receive = Math.max(numericAmount - WITHDRAWAL_FEE_USDT, 0);
  const receiveLabel = `${receive.toFixed(2)} ${symbol}`;

  const submit = () => {
    router.navigate(
      `/wallet/withdraw/submitted?amount=${encodeURIComponent(
        amount
      )}&asset=${symbol}&receive=${encodeURIComponent(receiveLabel)}`
    );
  };

  return (
    <AppBackground>
      <ScreenIntro
        title="Confirm withdrawal"
        description="Review every detail before submitting."
        hasBackBtn
      />

      <AppKeyboardScrollView
        contentContainerStyle={{ paddingTop: 20, gap: 16 }}
      >
        <View style={styles.rows}>
          <Text style={styles.amount}>
            {amount} {symbol}
          </Text>

          <Row label="Asset" value={symbol} />
          <Row label="Network" value={network} />
          <Row label="Address" value={address} />
          <Row
            label="Fee"
            value={`${WITHDRAWAL_FEE_USDT.toFixed(2)} ${symbol}`}
          />
          <Row label="You receive" value={receiveLabel} />
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
            disabled={pin.length < 4}
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
    paddingBottom: 60,
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
