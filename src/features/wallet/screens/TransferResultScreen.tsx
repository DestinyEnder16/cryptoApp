import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Row } from './WithdrawalSubmittedScreen';

export default function TransferResultScreen() {
  const params = useLocalSearchParams<{
    reference?: string;
    assetSymbol?: string;
    amount?: string;
    recipientName?: string;
    recipientEmail?: string;
  }>();

  const reference = params.reference ?? '—';
  const assetSymbol = params.assetSymbol ?? 'USDT';
  const amount = params.amount ?? '0';
  const recipientName = params.recipientName ?? '—';
  const recipientEmail = params.recipientEmail ?? '—';

  return (
    <AppBackground>
      <ScreenIntro
        title="Transfer sent"
        description="Your transfer was completed successfully."
        hasBackBtn={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30, gap: 24 }}
      >
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={44} color={Colors.dark} />
        </View>

        <View style={styles.rows}>
          <Text style={styles.amountText}>
            {amount} {assetSymbol}
          </Text>
          <Row label="To" value={recipientName} />
          <Row label="Email" value={recipientEmail} />
          <Row label="Asset" value={assetSymbol} />
          <Row label="Fee" value={`0.00 ${assetSymbol}`} />
          <Row label="Reference" value={reference} />
          <Row label="Status" value="Completed" />
        </View>
      </ScrollView>

      <Btn
        text="Done"
        fontSize={13}
        action={() => {
          router.dismissAll();
          router.navigate('/wallet/main');
        }}
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
    marginVertical: 16,
  },
  rows: {
    backgroundColor: '#141820',
    paddingHorizontal: 20,
    gap: 20,
    borderRadius: 14,
    paddingTop: 30,
    paddingBottom: 30,
  },
  amountText: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
});
