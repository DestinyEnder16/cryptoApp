import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import LockedKycTrade from '@/src/components/LockedKycTrade';
import ScreenIntro from '@/src/components/ScreenIntro';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Locked() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Buy Bitcoin"
        description="Create a quote after your verification is approved"
      />

      <LockedKycTrade />

      <View style={{ marginTop: 50 }}>
        <Btn action={() => router.navigate('/kyc')} text="Verify Identity" />
      </View>
    </AppBackground>
  );
}
