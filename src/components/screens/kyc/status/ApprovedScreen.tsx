import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { router } from 'expo-router';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

// Layout stub — UI to be designed.
export default function ApprovedScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Verification approved"
        description="Your account limits have been upgraded."
        hasBackBtn
      />

      <KycStepper currentStep={3} />
      <Btn
        text="Start trading"
        fontSize={13}
        action={() => router.navigate('/(tabs)/home')}
      />
    </AppBackground>
  );
}
