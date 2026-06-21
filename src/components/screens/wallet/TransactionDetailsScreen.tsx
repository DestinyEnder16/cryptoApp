import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { StatusRow } from '@/src/components/screens/kyc/status/StatusRow';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { getTransactionById } from '@/src/data/sandboxWallet';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 30, gap: 20 }}
          >
            <View style={styles.headline}>
              <Text style={[styles.amount, { color: amountColor }]}>
                {tx.detailAmount}
              </Text>
              <Text style={styles.status}>
                {tx.status === 'pending' ? 'Pending review' : 'Completed'}
              </Text>
            </View>

            <View style={styles.rows}>
              <StatusRow label="Reference" value={tx.reference} />
              <StatusRow label="Asset" value={tx.asset} />
              <StatusRow label="Network" value={tx.network} />
              <StatusRow label="Rate" value={tx.rate} />
              <StatusRow label="Created" value={CREATED} />
              <StatusRow
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
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    padding: 24,
    gap: 8,
  },
  amount: {
    fontFamily: Fonts.bold,
    fontSize: 30,
  },
  status: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  rows: {
    gap: 12,
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
