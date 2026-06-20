import Btn from '@/src/components/Btn';
import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { router } from 'expo-router';
import AppBackground from '../../../AppBackground';

// Layout stub — UI to be designed.
export default function IdentityScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Identity details"
        description="Enter details exactly as they appear on your document."
        hasBackBtn
      />

      <KycStepper currentStep={1} />

      <Btn
        text="Continue"
        fontSize={13}
        action={() => router.navigate('/kyc/process/document/upload')}
      />
    </AppBackground>
  );
}
