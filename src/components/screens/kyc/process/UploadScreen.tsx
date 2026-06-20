import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

// Layout stub — UI to be designed.
export default function UploadScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Upload document"
        description="Use a clear photo. All corners should be visible and text readable."
        hasBackBtn
      />

      <KycStepper currentStep={2} style={{ marginTop: 10 }} />

      <Btn
        text="Upload and continue"
        fontSize={13}
        action={() => router.navigate('/kyc/process/document/selfie')}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: Fonts.bold, fontSize: 20, color: Colors.text },
});
