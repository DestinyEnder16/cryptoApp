import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatAmount } from '@/src/shared/helpers/formatAmount';
import { getApiErrorMessage } from '@/src/shared/helpers/getApiErrorMessage';
import { useExecuteTradeMutation, useGetQuoteQuery } from '@/src/features/trades/store/tradeApi';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const PIN_LENGTH = 4;

export default function ConfirmTradeScreen() {
  const { quoteId } = useLocalSearchParams<{ quoteId?: string }>();

  const { data: quote, isLoading: quoteLoading } = useGetQuoteQuery(quoteId!, {
    skip: !quoteId,
  });

  const [executeTrade, { isLoading: executing }] = useExecuteTradeMutation();
  const [pin, setPin] = useState('');
  const pinInputRef = useRef<TextInput>(null);

  function handlePinChange(text: string) {
    setPin(text.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH));
  }

  function handleExecute() {
    if (pin.length < PIN_LENGTH || !quoteId) return;
    void executeTrade({ quoteId, pin })
      .unwrap()
      .then(
        (result) => {
          const tx = result.transaction;
          router.replace({
            pathname: '/trades/result',
            params: {
              status:    'completed',
              txnId:     tx.id,
              reference: tx.reference,
              fromAsset: tx.fromAsset,
              toAsset:   tx.toAsset,
              fromAmount: String(tx.fromAmount),
              toAmount:   String(tx.toAmount),
              feeAmount:  String(tx.feeAmount),
            },
          });
        },
        (err: unknown) => {
          const message = getApiErrorMessage(err, 'Trade execution failed.');
          setPin('');
          router.navigate({
            pathname: '/trades/result',
            params: {
              status:       'failed',
              errorMessage: message,
              fromAsset:    quote?.fromAsset ?? '',
              toAsset:      quote?.toAsset ?? '',
              fromAmount:   String(quote?.fromAmount ?? ''),
            },
          });
        }
      );
  }

  const tradeLabel = quote
    ? `${quote.type.charAt(0).toUpperCase() + quote.type.slice(1)} ${quote.toAsset}`
    : '…';

  return (
    <AppBackground>
      <ScreenIntro
        title="Confirm trade"
        description="Enter your transaction PIN to execute this quote."
        hasBackBtn
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingTop: 24, gap: 20 }}>
          {/* Trade summary card */}
          {quoteLoading ? (
            <ActivityIndicator color={Colors.green} />
          ) : quote ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{tradeLabel}</Text>
              <Text style={styles.summaryLine}>
                {formatAmount(quote.fromAmount)} {quote.fromAsset} →{' '}
                {formatAmount(quote.toAmount)} {quote.toAsset}
              </Text>
              <Text style={styles.summaryFee}>
                Fee {formatAmount(quote.feeAmount)} {quote.fromAsset}
              </Text>
            </View>
          ) : null}

          {/* Transaction PIN label */}
          <Text style={styles.pinLabel}>Transaction PIN</Text>

          {/* PIN slots — tap anywhere to focus the hidden input */}
          <Pressable
            style={styles.pinDotsRow}
            onPress={() => pinInputRef.current?.focus()}
          >
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <View key={i} style={styles.pinBox}>
                <View style={[styles.pinDot, i < pin.length && styles.pinDotFilled]} />
              </View>
            ))}
          </Pressable>

          {/* Hidden native input that captures the PIN */}
          <TextInput
            ref={pinInputRef}
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="numeric"
            secureTextEntry
            maxLength={PIN_LENGTH}
            style={styles.hiddenInput}
            autoFocus
          />

          {/* Disclaimer card */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTxt}>
              The API executes only after POST /trade/execute with quoteId and
              PIN.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={{ paddingBottom: 8 }}>
          {executing ? (
            <ActivityIndicator
              color={Colors.green}
              style={{ paddingVertical: 20 }}
            />
          ) : (
            <Btn
              text="Execute trade"
              action={handleExecute}
              disabled={pin.length < PIN_LENGTH}
              fontSize={16}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  summaryTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  summaryLine: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  summaryFee: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  pinLabel: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  pinBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.ash,
  },
  pinDotFilled: {
    backgroundColor: Colors.text,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  disclaimerCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  disclaimerTxt: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
});
