import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { router } from 'expo-router';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

// Layout stub — UI to be designed.
export default function RejectedScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Review needs attention"
        description="Compliance could not approve your submission yet."
        hasBackBtn
      />

      <KycStepper currentStep={3} />
      <Btn
        text="Resubmit documents"
        fontSize={13}
        action={() => router.navigate('/kyc/process/document/upload')}
      />
    </AppBackground>
  );
}
