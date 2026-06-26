import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatAmount } from '@/src/helpers/formatAmount';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.infoRow}>
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

  return (
    <AppBackground>
      <ScreenIntro
        title={isCompleted ? 'Trade completed' : 'Trade failed'}
        description={
          isCompleted
            ? 'Your order has been settled successfully.'
            : 'The trade could not be completed.'
        }
      />

      <View style={{ flex: 1, paddingTop: 32, gap: 28 }}>
        {/* Status icon */}
        <View style={styles.iconWrap}>
          <View
            style={[
              styles.iconCircle,
              isCompleted ? styles.iconCircleGreen : styles.iconCircleRed,
            ]}
          >
            <Text style={styles.iconTxt}>{isCompleted ? '✓' : '✕'}</Text>
          </View>
        </View>

        {/* Detail rows */}
        <View style={styles.card}>
          {isCompleted ? (
            <>
              {!!reference && <InfoRow label="Reference" value={reference} />}
              <InfoRow label="Pair" value={`${fromAsset} → ${toAsset}`} />
              <InfoRow
                label="Received"
                value={`${toAmount ? formatAmount(parseFloat(toAmount)) : '--'} ${toAsset ?? ''}`}
              />
              <InfoRow
                label="Fee"
                value={`${feeAmount ? formatAmount(parseFloat(feeAmount)) : '--'} ${fromAsset ?? ''}`}
              />
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={[styles.infoValue, { color: Colors.green }]}>
                  Completed
                </Text>
              </View>
            </>
          ) : (
            <>
              <InfoRow label="Pair" value={`${fromAsset} → ${toAsset}`} />
              {!!fromAmount && (
                <InfoRow
                  label="Required"
                  value={`${formatAmount(parseFloat(fromAmount))} ${fromAsset ?? ''}`}
                />
              )}
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={[styles.infoValue, { color: Colors.red }]}>
                  Failed
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Error detail card */}
        {!isCompleted && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              {errorMessage ?? 'Trade execution failed'}
            </Text>
            <Text style={styles.errorDesc}>
              Edit the amount and get a new quote to try again.
            </Text>
          </View>
        )}
      </View>

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
  iconWrap: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleGreen: {
    backgroundColor: Colors.lime,
    borderWidth: 2,
    borderColor: Colors.green,
  },
  iconCircleRed: {
    backgroundColor: '#2A0D0D',
    borderWidth: 2,
    borderColor: Colors.red,
  },
  iconTxt: {
    fontSize: 36,
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
  card: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBackgroundColor,
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
    marginLeft: 12,
  },
  errorCard: {
    backgroundColor: '#2A0D0D',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.red,
    gap: 8,
  },
  errorTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  errorDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 20,
  },
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
