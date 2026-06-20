import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

const PARTS = [
  { label: 'Front required', active: true },
  { label: 'Back optional', active: false },
  { label: 'Passport page', active: false },
];

export default function UploadScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Upload document"
        description="Use a clear photo. All corners should be visible and text readable."
        hasBackBtn
      />

      <KycStepper currentStep={2} style={{ marginTop: 10 }} />

      <View style={styles.content}>
        <View style={styles.partRow}>
          {PARTS.map((part) => (
            <View
              key={part.label}
              style={[styles.partCard, part.active && styles.partCardActive]}
            >
              <View
                style={[
                  styles.partCircle,
                  part.active && styles.partCircleActive,
                ]}
              />
              <Text
                style={[
                  styles.partLabel,
                  part.active && styles.partLabelActive,
                ]}
              >
                {part.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.dropzone}>
          <View style={styles.dropCircle} />
          <Text style={styles.dropTxt}>Upload document front</Text>
        </View>

        <View style={styles.acceptedRow}>
          <Text style={styles.acceptedLabel}>Accepted files</Text>
          <Text style={styles.acceptedValue}>JPG · PNG</Text>
        </View>
      </View>

      <Btn
        text="Upload and continue"
        fontSize={13}
        action={() => router.navigate('/kyc/process/document/selfie')}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 30,
  },
  partRow: {
    flexDirection: 'row',
    gap: 12,
  },
  partCard: {
    flex: 1,
    minHeight: 110,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  partCardActive: {
    backgroundColor: '#2B8A63',
  },
  partCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: Colors.dotInactive,
  },
  partCircleActive: {
    backgroundColor: Colors.green,
  },
  partLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.ash,
  },
  partLabelActive: {
    color: Colors.text,
  },
  dropzone: {
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 36,
    alignItems: 'center',
    gap: 18,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  dropCircle: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: Colors.lime,
  },
  dropTxt: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.text,
  },
  acceptedRow: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  acceptedLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.ash,
  },
  acceptedValue: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.text,
  },
});
