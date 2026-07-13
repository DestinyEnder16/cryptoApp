import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatFullDate } from '@/src/features/wallet/helpers/formatTxDate';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface RowProps {
  label: string;
  value: string;
}

export function Row({ label, value }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function WithdrawalSubmittedScreen() {
  const params = useLocalSearchParams<{
    amount?: string;
    asset?: string;
    fee?: string;
    reference?: string;
    createdAt?: string;
  }>();

  const symbol = params.asset ?? 'USDT';
  const amount = params.amount ?? '0.00';
  const fee = params.fee ?? '—';
  const reference = params.reference ?? '—';
  const createdAt = params.createdAt
    ? formatFullDate(params.createdAt)
    : formatFullDate(new Date().toISOString());

  return (
    <AppBackground>
      <ScreenIntro
        title="Withdrawal submitted"
        description="Finance review can approve or reject this request."
        hasBackBtn
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 30, gap: 24 }}
      >
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={44} color={Colors.dark} />
        </View>

        <View style={styles.rows}>
          <Row label="Status" value="Pending review" />
          <Row label="Amount" value={`${amount} ${symbol}`} />
          <Row label="Fee" value={`${fee} ${symbol}`} />
          <Row label="Reference" value={reference} />
          <Row label="Created" value={createdAt} />
        </View>
      </ScrollView>

      <Btn
        text="View transactions"
        fontSize={13}
        action={() => router.navigate('/wallet/transactions')}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.green,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    outlineColor: Colors.creditGreen,
    outlineWidth: 30,
  },
  rows: {
    backgroundColor: '#141820',
    paddingHorizontal: 20,
    gap: 20,
    borderRadius: 14,
    paddingTop: 30,
    paddingBottom: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowValue: {
    color: Colors.text,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  rowLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});
