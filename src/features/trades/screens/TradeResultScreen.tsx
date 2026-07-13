import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatAmount } from '@/src/shared/helpers/formatAmount';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

function InfoCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : {}]}>
        {value}
      </Text>
    </View>
  );
}

export default function TradeResultScreen() {
  const {
    status,
    txnId,
    reference,
    fromAsset,
    toAsset,
    toAmount,
    feeAmount,
    fromAmount,
    errorMessage,
  } = useLocalSearchParams<{
    status?: string;
    txnId?: string;
    reference?: string;
    fromAsset?: string;
    toAsset?: string;
    toAmount?: string;
    feeAmount?: string;
    fromAmount?: string;
    errorMessage?: string;
  }>();

  const isCompleted = status === 'completed';

  const toAmountFmt = toAmount
    ? `${formatAmount(parseFloat(toAmount))} ${toAsset ?? ''}`
    : '--';
  const fromAmountFmt = fromAmount
    ? `${formatAmount(parseFloat(fromAmount))} ${fromAsset ?? ''}`
    : '--';
  const feeAmountFmt = feeAmount
    ? `${formatAmount(parseFloat(feeAmount))} ${fromAsset ?? ''}`
    : '--';

  return (
    <AppBackground>
      <ScreenIntro
        title={isCompleted ? 'Trade completed' : 'Trade failed'}
        description={
          isCompleted
            ? 'Your sandbox trade has settled successfully.'
            : 'The trade could not be completed.'
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 28, paddingBottom: 32, gap: 10 }}
      >
        {/* Status icon */}
        <View style={styles.iconWrap}>
          <View
            style={isCompleted ? styles.successCircle : styles.failedCircle}
          >
            <Text style={isCompleted ? styles.successMark : styles.failedMark}>
              {isCompleted ? '✓' : '✕'}
            </Text>
          </View>
        </View>

        {/* Heading below icon */}
        <View style={styles.headingWrap}>
          <Text style={styles.heading}>
            {isCompleted
              ? `${toAmountFmt} received`
              : errorMessage ?? 'Trade failed'}
          </Text>
          {!isCompleted && (
            <Text style={styles.headingDesc}>
              Check your details and try again with a new quote.
            </Text>
          )}
        </View>

        {/* Info cards */}
        {isCompleted ? (
          <>
            {!!reference && <InfoCard label="Reference" value={reference} />}
            <InfoCard label="Paid" value={fromAmountFmt} />
            <InfoCard label="Received" value={toAmountFmt} />
            <InfoCard label="Fee" value={feeAmountFmt} />
            <InfoCard
              label="Status"
              value="Completed"
              valueColor={Colors.green}
            />
          </>
        ) : (
          <>
            <InfoCard label="Required" value={fromAmountFmt} />
            <InfoCard label="Available" value="—" valueColor={Colors.red} />
            <InfoCard label="Status" value="Failed" valueColor={Colors.red} />
          </>
        )}
      </ScrollView>

      {isCompleted ? (
        <Btn
          text="View transaction"
          action={() =>
            txnId
              ? router.navigate(`/wallet/transactions/${txnId}`)
              : router.dismissTo('/wallet/main')
          }
          fontSize={16}
        />
      ) : (
        <Pressable
          style={styles.editBtn}
          onPress={() => router.dismissTo('/trades/main')}
        >
          <Text style={styles.editBtnTxt}>Edit amount</Text>
        </Pressable>
      )}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  // ── Icons ─────────────────────────────────────────────────────────────────
  iconWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successMark: {
    color: Colors.dark,
    fontSize: 44,
    fontFamily: Fonts.bold,
    lineHeight: 54,
  },
  failedCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3D1515',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failedMark: {
    color: Colors.red,
    fontSize: 44,
    fontFamily: Fonts.bold,
    lineHeight: 54,
  },

  // ── Heading ───────────────────────────────────────────────────────────────
  headingWrap: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 64,
  },
  heading: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
    textAlign: 'center',
  },
  headingDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Info cards (individual, stacked) ─────────────────────────────────────
  infoCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  infoValue: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 13,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 16,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  editBtn: {
    backgroundColor: Colors.red,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  editBtnTxt: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});
