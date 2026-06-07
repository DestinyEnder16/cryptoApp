import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import { usePadding } from '@/src/hooks/usePadding';
import { Text, View } from 'react-native';

export default function Index() {
  const paddingTop = usePadding();
  return (
    <AppBackground>
      <View style={{ paddingTop }}>
        <ScreenIntro
          title="Security"
          description="Protect account access and sensitive actions."
        />

        <Text>Hey world</Text>
      </View>
    </AppBackground>
  );
}
