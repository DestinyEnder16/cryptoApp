import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import KycStepper from '@/src/features/kyc/components/KycStepper';
import LimitInfoField from '@/src/features/kyc/components/LimitInfoField';
import ScreenIntro from '@/src/shared/components/ScreenIntro';

const LEVELS = [
  {
    title: 'Starter',
    desc: 'Trade locked · Withdraw locked · $100 deposit',
  },
  {
    title: 'Review',
    desc: 'Documents submitted · $250 deposit',
  },
  {
    title: 'Verified',
    desc: '$5,000 trade · $2,500 withdrawal',
  },
];

export default function AccountLimits() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Account limits"
        hasBackBtn
        description="Your verification level controls trade, withdrawal, and sandbox deposit access."
      />

      <KycStepper currentStep={0} />

      <View style={{ gap: 50 }}>
        <View style={{ gap: 30, marginTop: 40 }}>
          {LEVELS.map((level, index) => (
            <LimitInfoField
              title={level.title}
              level={index}
              info={level.desc}
              key={index}
              active={index === 2}
            />
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTxt}>
            Verification is required before executing quotes or requesting
            withdrawals.
          </Text>
        </View>

        <Btn
          text="Continue"
          fontSize={13}
          action={() => router.navigate('/kyc/process')}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    padding: 20,
  },
  infoTxt: {
    color: Colors.text,
    fontFamily: Fonts.regular,
  },
});
