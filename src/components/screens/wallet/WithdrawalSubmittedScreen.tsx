import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { StatusRow } from '@/src/components/screens/kyc/status/StatusRow';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { WITHDRAWAL_FEE_USDT } from '@/src/data/sandboxWallet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

const REFERENCE = 'wd_8392';
const RELATED_TX = 'txw_8392';

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
          <StatusRow label="Status" value="Pending review" />
          <StatusRow label="Amount" value={`${amount} ${symbol}`} />
          <StatusRow
            label="Fee"
            value={`${WITHDRAWAL_FEE_USDT.toFixed(2)} ${symbol}`}
          />
          <StatusRow label="Reference" value={REFERENCE} />
          <StatusRow label="Created" value="May 27, 2026" />
        </View>
      </ScrollView>

      <Btn
        text="View transaction"
        fontSize={13}
        action={() => router.navigate(`/wallet/transactions/${RELATED_TX}`)}
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
  },
  rows: {
    gap: 12,
  },
});
