import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import { View } from 'react-native';

export default function Devices() {
  return (
    <AppBackground>
      <View>
        <ScreenIntro
          title="Devices"
          description="Registered devices for push notification and session awareness."
        />
      </View>
    </AppBackground>
  );
}
