import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { describeTransaction } from '@/src/features/wallet/helpers/describeTransaction';
import { formatAmount } from '@/src/shared/helpers/formatAmount';
import { formatFullDate } from '@/src/features/wallet/helpers/formatTxDate';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import { useGetTransactionByIdQuery } from '@/src/features/wallet/store/walletApi';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Row } from './WithdrawalSubmittedScreen';

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: tx, isLoading } = useGetTransactionByIdQuery(id!, { skip: !id });

  const display = tx ? describeTransaction(tx) : null;

  const amountColor =
    display?.direction === 'credit'
      ? Colors.green
      : display?.direction === 'debit'
      ? Colors.red
      : Colors.text;

  const isPositive = display?.direction === 'credit';
  const isNeutral = display?.direction === 'neutral';
  const feeAsset = tx?.toAsset ?? tx?.fromAsset ?? '';

  return (
    <AppBackground>
      <ScreenIntro
        title="Transaction details"
        description="A single ledger entry with status and reference."
        hasBackBtn
      />

      {isLoading ? (
        <ActivityIndicator
          color={Colors.green}
          style={{ marginTop: 60 }}
          size="large"
        />
      ) : tx && display ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 30, gap: 20 }}
          >
            <View
              style={[
                styles.headline,
                isPositive
                  ? { backgroundColor: Colors.creditGreen }
                  : isNeutral
                  ? { backgroundColor: Colors.secondaryBackgroundColor }
                  : { backgroundColor: Colors.dotInactive },
              ]}
            >
              <Text style={styles.headlineTitle}>{display.title}</Text>
              <Text style={[styles.amount, { color: amountColor }]}>
                {display.detailAmount}
              </Text>
              <Text
                style={[
                  styles.status,
                  tx.status === 'completed'
                    ? { color: Colors.text }
                    : { color: Colors.textMuted },
                ]}
              >
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </Text>
            </View>

            <View style={styles.rows}>
              <Row label="Reference" value={tx.reference} />
              {!!tx.fromAsset && <Row label="From" value={tx.fromAsset} />}
              {!!tx.toAsset && <Row label="To" value={tx.toAsset} />}
              {tx.rate != null && (
                <Row label="Rate" value={formatPrice(tx.rate)} />
              )}
              {tx.feeAmount != null && (
                <Row
                  label="Fee"
                  value={`${formatAmount(tx.feeAmount)} ${feeAsset}`.trim()}
                />
              )}
              {!!tx.note && <Row label="Note" value={tx.note} />}
              <Row label="Created" value={formatFullDate(tx.createdAt)} />
              <Row label="Completed" value={formatFullDate(tx.completedAt)} />
            </View>
          </ScrollView>

          <Btn
            text="Back to wallet"
            fontSize={13}
            action={() => router.dismissTo('/wallet/main')}
          />
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>Transaction not found.</Text>
        </View>
      )}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  headline: {
    borderRadius: 20,
    padding: 24,
    gap: 8,
    marginVertical: 24,
  },
  headlineTitle: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 16,
  },
  amount: {
    fontFamily: Fonts.bold,
    fontSize: 30,
  },
  status: {
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  rows: {
    backgroundColor: '#141820',
    paddingHorizontal: 20,
    gap: 20,
    borderRadius: 14,
    paddingTop: 30,
    paddingBottom: 60,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTxt: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
