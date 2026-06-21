import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import LockedKycTrade from '@/src/components/LockedKycTrade';
import ScreenIntro from '@/src/components/ScreenIntro';
import { useVerification } from '@/src/hooks/useVerification';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Locked() {
  const { kycStatus } = useVerification();
  // Only a brand-new user starts verification; everyone else (pending/rejected)
  // has already submitted, so point them at their status instead.
  const hasStartedKyc = kycStatus !== undefined && kycStatus !== 'not_started';

  return (
    <AppBackground>
      <ScreenIntro
        title="Buy Bitcoin"
        description="Create a quote after your verification is approved"
      />

      <LockedKycTrade />

      <View style={{ marginTop: 50 }}>
        <Btn
          action={() => router.navigate('/kyc')}
          text={hasStartedKyc ? 'View verification status' : 'Verify Identity'}
          fontSize={13}
        />
      </View>
    </AppBackground>
  );
}
