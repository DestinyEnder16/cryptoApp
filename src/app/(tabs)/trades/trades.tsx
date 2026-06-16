import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import { View } from 'react-native';

export default function Trades() {
  return (
    <AppBackground>
      <View style={{ paddingHorizontal: 20 }}>
        <ScreenIntro
          title="Trade"
          description="Buy, sell, or swap with quotes that expire before execution."
        />
      </View>
    </AppBackground>
  );
}
