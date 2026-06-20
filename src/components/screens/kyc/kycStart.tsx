import { router } from 'expo-router';
import { View } from 'react-native';
import AppBackground from '../../AppBackground';
import Btn from '../../Btn';
import KycLevelCard from '../../KycLevelCard';
import KycStepper from '../../KycStepper';
import ScreenIntro from '../../ScreenIntro';
import InfoCard, { InfoStatus } from '../../SpecialInfoField';

interface LimitDetails {
  title: string;
  info: string;
  status: InfoStatus;
}

type LimitData = LimitDetails[];

const LIMITS: LimitData = [
  {
    title: 'Trade Limit',
    info: 'Locked',
    status: 'error',
  },
  {
    status: 'error',
    title: 'Withdrawal Limit',
    info: 'Locked',
  },
  {
    status: undefined,
    title: 'Sandbox deposit',
    info: '$100 max',
  },
];

export default function KycStart() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Verify to unlock limits"
        hasBackBtn
        description="Complete identity verification from inside the app before high-value trading or withdrawals."
      />
      <KycStepper currentStep={0} />

      <View style={{ marginVertical: 40 }}>
        <KycLevelCard
          level={0}
          title="Started Account"
          description="Browse markets now. Verify to trade, withdraw, and raise sandbox deposit limits."
        />

        <View style={{ gap: 15 }}>
          {LIMITS.map((limit, index) => (
            <InfoCard
              info={limit.info}
              title={limit.title}
              key={index}
              state={limit.status}
            />
          ))}
        </View>
      </View>

      <Btn
        text="Start verification"
        fontSize={13}
        action={() => router.navigate('/kyc/limits')}
      />
    </AppBackground>
  );
}
