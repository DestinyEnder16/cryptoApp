import ActionBtn from '@/src/components/ActionBtn';
import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useVerification } from '@/src/hooks/useVerification';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppBackground from '../../../AppBackground';
import { StatusRow } from './StatusRow';

export default function RejectedScreen() {
  const { label } = useVerification();

  return (
    <AppBackground>
      <ScreenIntro
        title="Review needs attention"
        description="Compliance could not approve your submission yet."
        hasBackBtn
      />

      <KycStepper currentStep={1} />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="alert" size={48} color={Colors.text} />
        </View>

        <Text style={styles.title}>Try again</Text>

        <View style={styles.reason}>
          <Text style={styles.reasonLabel}>Reason</Text>
          <Text style={styles.reasonTxt}>
            We couldn&apos;t verify your documents. Upload clearer images with
            all corners visible and good lighting.
          </Text>
        </View>

        <View style={styles.rows}>
          <StatusRow label="Current level" value={label ?? 'Starter'} />
        </View>
      </View>

      <ActionBtn
        text="Resubmit documents"
        styles={{ backgroundColor: Colors.red, txtColor: Colors.text }}
        action={() => router.navigate('/kyc/process')}
      />
    </AppBackground>
  );
}

const BADGE = 132;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    backgroundColor: 'rgba(221, 75, 75, 0.18)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
  },
  reason: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 8,
  },
  reasonLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.ash,
  },
  reasonTxt: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  rows: {
    gap: 12,
  },
});
