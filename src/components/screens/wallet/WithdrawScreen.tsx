import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletField from '@/src/components/wallet/WalletField';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { sandboxAssets } from '@/src/data/sandboxWallet';
import { formatPrice } from '@/src/helpers/formatPrice';
import { useVerification } from '@/src/hooks/useVerification';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const NETWORK = 'TRC20 sandbox network';

export default function WithdrawScreen() {
  const { limits } = useVerification();
  const asset = sandboxAssets[0]; // USDT

  const [amount, setAmount] = useState('100.00');
  const [address, setAddress] = useState('');

  const perTxLimit = limits?.withdrawalPerTransactionUsd ?? 1000;
  const dailyLimit = limits?.dailyWithdrawalUsd ?? 5000;

  return (
    <AppBackground>
      <ScreenIntro
        title="Withdraw"
        description="Withdrawals require verification and transaction PIN."
        hasBackBtn
      />

      <AppKeyboardScrollView
        contentContainerStyle={{ paddingTop: 20, gap: 16 }}
      >
        <WalletField
          label="Asset"
          value={`${asset.symbol} · Available ${asset.units}`}
        />

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

        <WalletField label="Destination address">
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            autoCapitalize="none"
            placeholder="TXYZ...8K21"
            placeholderTextColor={Colors.textMuted}
          />
        </WalletField>

        <WalletField label="Network" value={NETWORK} />

        <View style={[styles.limitCard, { backgroundColor: Colors.lime }]}>
          <Text style={styles.limitLabel}>Verified limit</Text>
          <Text style={styles.limitValue}>
            {formatPrice(perTxLimit, 0)} per request ·{' '}
            {formatPrice(dailyLimit, 0)} daily
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            marginBottom: 10,
          }}
        >
          <Btn
            text="Preview withdrawal"
            fontSize={13}
            disabled={amount.trim() === ''}
            action={() =>
              router.navigate(
                `/wallet/withdraw/confirm?amount=${encodeURIComponent(
                  amount
                )}&address=${encodeURIComponent(
                  address || 'TXYZ...8K21'
                )}&asset=${asset.symbol}&network=${encodeURIComponent(NETWORK)}`
              )
            }
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
  limitCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 8,
  },
  limitLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  limitValue: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
