import AppBackground from '@/src/components/AppBackground';
import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { View } from 'react-native';

export default function Index() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Verify to unlock limits"
        hasBackBtn
        description="Complete identity verification from inside the app before high-value trading or withdrawals."
      />
      <View style={{ marginTop: 20, paddingHorizontal: 40 }}>
        <KycStepper currentStep={2} />
      </View>
    </AppBackground>
  );
}
