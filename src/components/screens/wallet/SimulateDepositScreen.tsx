import AppBackground from '@/src/components/AppBackground';
import AppKeyboardScrollView from '@/src/components/AppKeyboardScrollView';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletField from '@/src/components/wallet/WalletField';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { SETTLEMENT_DELAYS } from '@/src/data/sandboxWallet';
import { showToast } from '@/src/helpers/showToast';
import {
  useGetTransactionByIdQuery,
  useSimulateDepositMutation,
  walletApi,
} from '@/src/store/api/walletApi';
import { useAppDispatch } from '@/src/store/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

/** Extract the transaction id from the server's pollingUrl path. */
const idFromUrl = (url: string) => url.split('/').pop() ?? null;

export default function SimulateDepositScreen() {
  const { asset } = useLocalSearchParams<{ asset?: string }>();
  const symbol = asset ?? 'USDT';
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState('250.00');
  const [delay, setDelay] = useState(SETTLEMENT_DELAYS[0]);

  const [simulate, { isLoading: isSubmitting }] = useSimulateDepositMutation();
  const [pollingId, setPollingId] = useState<string | null>(null);

  // Poll every 2 s until the transaction settles. pollingInterval: 0 = disabled.
  const { data: polledTx } = useGetTransactionByIdQuery(pollingId!, {
    skip: !pollingId,
    pollingInterval: 2000,
  });

  // Once the server marks the deposit completed, refresh the wallet + tx list
  // and navigate home.
  useEffect(() => {
    if (polledTx?.status !== 'completed') return;
    dispatch(walletApi.util.invalidateTags(['Wallet', 'Transaction']));
    showToast({
      type: 'success',
      title: 'Deposit completed',
      message: `+${amount} ${symbol} is now available in your wallet.`,
    });
    router.dismissTo('/wallet/main');
  }, [polledTx?.status]);

  const submit = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount) return;

    try {
      const result = await simulate({
        amount: numericAmount,
        settlementDelaySeconds: delay.seconds,
      }).unwrap();

      setPollingId(idFromUrl(result.pollingUrl));
    } catch {
      showToast({
        type: 'error',
        title: 'Deposit failed',
        message: 'Could not create the sandbox deposit. Please try again.',
      });
    }
  };

  const previewAmount = amount.trim() === '' ? '0.00' : amount;
  const isPending = !!pollingId && polledTx?.status !== 'completed';

  // Pending state: show a waiting screen while we poll.
  if (isPending) {
    return (
      <AppBackground>
        <ScreenIntro
          title="Settling deposit"
          description="Your deposit is being processed."
          hasBackBtn
        />
        <View style={styles.pendingWrap}>
          <ActivityIndicator color={Colors.green} size="large" />
          <Text style={styles.pendingAmount}>
            +{previewAmount} {symbol}
          </Text>
          <Text style={styles.pendingNote}>
            Settling in {delay.label} — this screen will update automatically.
          </Text>
        </View>
      </AppBackground>
    );
  }

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
            disabled={isSubmitting || amount.trim() === ''}
            action={submit}
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
  pendingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 32,
  },
  pendingAmount: {
    color: Colors.green,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  pendingNote: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});
