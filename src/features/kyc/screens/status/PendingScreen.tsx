import KycStepper from '@/src/features/kyc/components/KycStepper';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatPrice } from '@/src/shared/helpers/formatPrice';
import { useVerification } from '@/src/features/kyc/hooks/useVerification';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import { StatusRow } from './StatusRow';

export default function PendingScreen() {
  const { label, limits } = useVerification();

  return (
    <AppBackground>
      <ScreenIntro
        title="Review in progress"
        description="Your identity submission has been sent for manual review."
        hasBackBtn
      />

      <KycStepper currentStep={3} />

      <View style={styles.content}>
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <View style={styles.dots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.title}>Pending review</Text>
          <Text style={styles.subtitle}>
            You can browse markets while we review your documents. Trading and
            withdrawals stay locked.
          </Text>
        </View>

        <View style={styles.rows}>
          <StatusRow label="Current level" value={label ?? 'Review'} />
          <StatusRow
            label="Sandbox deposit"
            value={`${formatPrice(limits?.depositPerTransactionUsd ?? 0, 0)} max`}
          />
        </View>
      </View>

      <Btn
        text="Back to home"
        fontSize={13}
        action={() => router.navigate('/(tabs)/home')}
      />
    </AppBackground>
  );
}

const RING_OUTER = 150;
const RING_INNER = 104;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 28,
  },
  ringOuter: {
    width: RING_OUTER,
    height: RING_OUTER,
    borderRadius: RING_OUTER / 2,
    backgroundColor: '#3D3320',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: RING_INNER,
    height: RING_INNER,
    borderRadius: RING_INNER / 2,
    backgroundColor: Colors.primaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.orangeBrown,
  },
  heading: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.ash,
    textAlign: 'center',
  },
  rows: {
    gap: 12,
  },
});
