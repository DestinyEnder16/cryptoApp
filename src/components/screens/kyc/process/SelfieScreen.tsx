import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

// Layout stub — UI to be designed.
export default function SelfieScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Selfie Check"
        description="Take a clear selfie so compliance can compare your face with your document."
        hasBackBtn
      />

      <KycStepper currentStep={2} />
      <Btn
        text="Upload selfie"
        fontSize={13}
        action={() => router.navigate('/kyc/process/review')}
      />
    </AppBackground>
  );
}
