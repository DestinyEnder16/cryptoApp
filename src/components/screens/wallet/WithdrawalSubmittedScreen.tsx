import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const REFERENCE = 'wd_8392';
// const RELATED_TX = 'txw_8392';

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
  const params = useLocalSearchParams<{ amount?: string; asset?: string }>();
  const symbol = params.asset ?? 'USDT';
  const amount = params.amount ?? '0.00';

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
          {/* <StatusRow label="Status" value="Pending review" />
          <StatusRow label="Amount" value={`${amount} ${symbol}`} />
          <StatusRow
            label="Fee"
            value={`${WITHDRAWAL_FEE_USDT.toFixed(2)} ${symbol}`}
          />
          <StatusRow label="Reference" value={REFERENCE} />
          <StatusRow label="Created" value="May 27, 2026" /> */}
          <Row label="Status" value="Pending review" />
          <Row label="Amount" value={`${amount} ${symbol}`} />
          <Row label="Fee" value={`${10000} ${symbol}`} />
          <Row label="Reference" value={REFERENCE} />
          <Row label="Created" value="May 27, 2026" />
        </View>
      </ScrollView>

      <Btn
        text="View transactions"
        fontSize={13}
        action={() => router.navigate(`/wallet/transactions`)}
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
