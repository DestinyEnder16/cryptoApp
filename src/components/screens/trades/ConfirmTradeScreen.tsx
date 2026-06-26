import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatAmount } from '@/src/helpers/formatAmount';
import { getApiErrorMessage } from '@/src/helpers/getApiErrorMessage';
import { useExecuteTradeMutation, useGetQuoteQuery } from '@/src/store/api/tradeApi';
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
    // Only digits, max PIN_LENGTH
    const clean = text.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
    setPin(clean);
  }

  async function handleExecute() {
    if (pin.length < PIN_LENGTH || !quoteId) return;
    try {
      const result = await executeTrade({ quoteId, pin }).unwrap();
      const tx = result.transaction;
      router.navigate(
        `/trades/result?status=completed` +
          `&txnId=${tx.id}` +
          `&reference=${tx.reference}` +
          `&fromAsset=${tx.fromAsset}` +
          `&toAsset=${tx.toAsset}` +
          `&fromAmount=${tx.fromAmount}` +
          `&toAmount=${tx.toAmount}` +
          `&feeAmount=${tx.feeAmount}`
      );
    } catch (err) {
      const message = getApiErrorMessage(err, 'Trade execution failed.');
      setPin('');
      router.navigate(
        `/trades/result?status=failed` +
          `&errorMessage=${encodeURIComponent(message)}` +
          `&fromAsset=${quote?.fromAsset ?? ''}` +
          `&toAsset=${quote?.toAsset ?? ''}` +
          `&fromAmount=${quote?.fromAmount ?? ''}`
      );
    }
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

          {/* PIN dots — tap to focus the hidden input */}
          <Pressable
            style={styles.pinDotsRow}
            onPress={() => pinInputRef.current?.focus()}
          >
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i < pin.length && styles.dotFilled]}
              />
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
    gap: 28,
    paddingVertical: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Colors.text,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
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
