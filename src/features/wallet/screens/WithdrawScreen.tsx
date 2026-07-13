import AppBackground from '@/src/shared/components/AppBackground';
import AppKeyboardScrollView from '@/src/shared/components/AppKeyboardScrollView';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import WalletField from '@/src/features/wallet/components/WalletField';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatAmount } from '@/src/shared/helpers/formatAmount';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import { useVerification } from '@/src/features/kyc/hooks/useVerification';
import { useGetWalletQuery } from '@/src/features/wallet/store/walletApi';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Platform, KeyboardAvoidingView } from 'react-native';

export default function WithdrawScreen() {
  const { limits } = useVerification();
  const { data: wallet } = useGetWalletQuery();

  const [amount, setAmount] = useState('100.00');
  const [address, setAddress] = useState('');

  // Withdraw from the first funded balance (USDT in the sandbox).
  const balances = wallet?.wallet.balances ?? [];
  const balance =
    balances.find((b) => b.assetSymbol === 'USDT') ?? balances[0];
  const symbol = balance?.assetSymbol ?? 'USDT';
  const network =
    wallet?.wallet.depositAddresses.find((a) => a.assetSymbol === symbol)
      ?.network ?? '—';
  const available = balance ? `${formatAmount(balance.available)} ${symbol}` : '—';

  const perTxLimit = limits?.withdrawalPerTransactionUsd ?? 1000;
  const dailyLimit = limits?.dailyWithdrawalUsd ?? 5000;

  return (
    <AppBackground>
      <ScreenIntro
        title="Withdraw"
        description="Withdrawals require verification and transaction PIN."
        hasBackBtn
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <AppKeyboardScrollView contentContainerStyle={{ paddingTop: 20, gap: 16 }}>
          <WalletField
            label="Asset"
            value={`${symbol} · Available ${available}`}
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

          <WalletField label="Network" value={network} />

          <View style={[styles.limitCard, { backgroundColor: Colors.lime }]}>
            <Text style={styles.limitLabel}>Verified limit</Text>
            <Text style={styles.limitValue}>
              {formatPrice(perTxLimit, 0)} per request ·{' '}
              {formatPrice(dailyLimit, 0)} daily
            </Text>
          </View>
        </AppKeyboardScrollView>

        <View style={{ paddingBottom: 8 }}>
          <Btn
            text="Preview withdrawal"
            fontSize={13}
            disabled={amount.trim() === ''}
            action={() =>
              router.navigate({
                pathname: '/wallet/withdraw/confirm',
                params: {
                  amount,
                  address: address || 'TXYZ...8K21',
                  asset:   symbol,
                  network,
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
