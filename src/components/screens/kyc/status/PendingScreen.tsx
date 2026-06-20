import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';

// Layout stub — UI to be designed.
export default function PendingScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Review in progress"
        description="Your identity submission has been sent for manual review."
        hasBackBtn
      />

      <KycStepper currentStep={3} />
      <Btn
        text="Back to home"
        fontSize={13}
        action={() => router.navigate('/(tabs)/home')}
      />
    </AppBackground>
  );
}
