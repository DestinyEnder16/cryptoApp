import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import AppBackground from '../../AppBackground';
import KycStepper from '../../KycStepper';
import ScreenIntro from '../../ScreenIntro';
import DocumentStep from './steps/DocumentStep';
import IdentityStep from './steps/IdentityStep';
import ReviewStep from './steps/ReviewStep';

// Ordered to match the KycStepper labels: identity → document → review.
const STEPS = [IdentityStep, DocumentStep, ReviewStep];

export default function KycProcess() {
  const [stepIndex, setStepIndex] = useState(0);

  // Stepper is 1-based: being on `identity` (index 0) marks step 1 active.
  const currentStep = (stepIndex + 1) as 1 | 2 | 3;

  const goNext = () =>
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

  // Backing out of the first sub-step leaves the process flow entirely.
  const goBack = () => {
    if (stepIndex === 0) {
      router.back();
      return;
    }
    setStepIndex((i) => i - 1);
  };

  const ActiveStep = STEPS[stepIndex];

  return (
    <AppBackground>
      <ScreenIntro
        title="Verify your identity"
        description="Complete each step to unlock trading and withdrawals."
      />

      <View style={{ marginTop: 20, paddingHorizontal: 40 }}>
        <KycStepper currentStep={currentStep} />
      </View>

      <View style={{ flex: 1, marginTop: 40 }}>
        <ActiveStep onNext={goNext} onBack={goBack} />
      </View>
    </AppBackground>
  );
}
