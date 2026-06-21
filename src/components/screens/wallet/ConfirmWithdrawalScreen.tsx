import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { StatusRow } from '@/src/components/screens/kyc/status/StatusRow';
import NumInputField from '@/src/components/NumInputField';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { WITHDRAWAL_FEE_USDT } from '@/src/data/sandboxWallet';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

      <AppKeyboardScrollView contentContainerStyle={{ paddingTop: 20, gap: 16 }}>
        <Text style={styles.amount}>
          {amount} {symbol}
        </Text>

        <View style={styles.rows}>
          <StatusRow label="Asset" value={symbol} />
          <StatusRow label="Network" value={network} />
          <StatusRow label="Address" value={address} />
          <StatusRow
            label="Fee"
            value={`${WITHDRAWAL_FEE_USDT.toFixed(2)} ${symbol}`}
          />
          <StatusRow label="You receive" value={receiveLabel} />
        </View>

        <View style={styles.pinBlock}>
          <Text style={styles.pinLabel}>Transaction PIN</Text>
          <NumInputField num={4} marginTop={12} onFill={setPin} />
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
    gap: 12,
  },
  pinBlock: {
    marginTop: 8,
  },
  pinLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
});
