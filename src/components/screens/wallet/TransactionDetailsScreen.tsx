import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { getTransactionById } from '@/src/data/sandboxWallet';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Row } from './WithdrawalSubmittedScreen';

const CREATED = 'May 27, 2026';

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const tx = getTransactionById(id);

  const amountColor =
    tx?.direction === 'credit'
      ? Colors.green
      : tx?.direction === 'debit'
      ? Colors.red
      : Colors.text;

  const isPositive = tx?.direction === 'credit';
  const isNeutral = tx?.direction === 'neutral';

  return (
    <AppBackground>
      <ScreenIntro
        title="Transaction details"
        description="A single ledger entry with status and reference."
        hasBackBtn
      />

      {tx ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 30,
              gap: 20,
            }}
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
              <Text style={styles.headlineTitle}>{tx.title}</Text>

              <Text style={[styles.amount, { color: amountColor }]}>
                {tx.detailAmount}
              </Text>
              <Text
                style={[
                  styles.status,
                  tx.status === 'completed'
                    ? { color: Colors.text }
                    : { color: Colors.textMuted },
                ]}
              >
                {tx.status === 'pending' ? 'Pending review' : 'Completed'}
              </Text>
            </View>

            <View style={styles.rows}>
              <Row label="Reference" value={tx.reference} />
              <Row label="Asset" value={tx.asset} />
              <Row label="Network" value={tx.network} />
              <Row label="Rate" value={tx.rate} />
              <Row label="Created" value={CREATED} />
              <Row
                label="Completed"
                value={tx.status === 'completed' ? CREATED : '—'}
              />
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
