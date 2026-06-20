import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { router } from 'expo-router';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

// Layout stub — UI to be designed.
export default function ReviewScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        hasBackBtn
        title="Review submission"
        description="Check the details and files before sending them for admin review."
      />

      <KycStepper currentStep={3} />
      <Btn
        text="Submit for review"
        fontSize={13}
        action={() => router.navigate('/kyc/status/pending')}
      />
    </AppBackground>
  );
}
