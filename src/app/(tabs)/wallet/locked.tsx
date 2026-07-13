import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import LockedKycWallet from '@/src/features/wallet/components/LockedKycWallet';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Locked() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Withdraw USDT"
        description="Verification controls how much you can move out of your wallet."
      />

      <View style={{ marginTop: 30, gap: 60 }}>
        <LockedKycWallet />

        <Btn
          text="View verification status"
          fontSize={13}
          action={() => router.navigate('/kyc')}
        />
      </View>
    </AppBackground>
  );
}
