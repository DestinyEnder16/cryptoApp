import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { documentTypeValueFromLabel } from '@/src/constants/documentTypes';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { useSubmitKycMutation } from '@/src/store/api/kycApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { resetKyc } from '@/src/store/slices/kycSlice';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function ReviewScreen() {
  const dispatch = useAppDispatch();
  const {
    name,
    country,
    documentType,
    documentNumber,
    documentImageUrl,
    documentBackImageUrl,
    selfieImageUrl,
  } = useAppSelector((state) => state.kyc);

  const [submitKyc, { isLoading: isSubmitting }] = useSubmitKycMutation();

  const documentTypeValue = documentTypeValueFromLabel(documentType);

  const canSubmit =
    !!name &&
    !!country &&
    !!documentTypeValue &&
    !!documentNumber &&
    !!selfieImageUrl &&
    !!documentImageUrl;

  const handleSubmit = async () => {
    if (!canSubmit) {
      showToast({
        type: 'error',
        title: 'Incomplete',
        message: 'Complete every step before submitting.',
      });
      return;
    }

    try {
      await submitKyc({
        legalName: name,
        country,
        documentType: documentTypeValue,
        documentNumber,
        selfieImageUrl,
        documentImageUrl,
        // The API rejects a null back-image URL — only include it when present.
        ...(documentBackImageUrl
          ? { documentBackImageUrl }
          : {}),
      }).unwrap();

      dispatch(resetKyc());
      router.navigate('/kyc/status/pending');
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        title: 'Submission failed',
        message: 'Could not submit for review. Try again.',
      });
    }
  };

  return (
    <AppBackground>
      <ScreenIntro
        hasBackBtn
        title="Review submission"
        description="Check the details and files before sending them for admin review."
      />

      <KycStepper currentStep={3} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Row label="Legal name" value={name || '—'} />
        <Row label="Country" value={country || '—'} />
        <Row label="Document" value={documentType || '—'} />
        <Row
          label="Document image"
          value={documentImageUrl ? 'Uploaded' : 'Missing'}
        />
        <Row
          label="Selfie image"
          value={selfieImageUrl ? 'Uploaded' : 'Missing'}
        />

        <View style={styles.note}>
          <Text style={styles.noteTxt}>
            After submission your status changes to pending and trade/withdraw
            remain locked until approved.
          </Text>
        </View>
      </ScrollView>

      <Btn
        text={isSubmitting ? 'Submitting…' : 'Submit for review'}
        fontSize={13}
        disabled={isSubmitting || !canSubmit}
        action={() => handleSubmit()}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    marginTop: 24,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  rowLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.ash,
  },
  rowValue: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  note: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  noteTxt: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.ash,
    textAlign: 'center',
  },
});
