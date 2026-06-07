import AppBackground from '@/src/components/AppBackground';
import ProfileInfoCard from '@/src/components/ProfileInfoCard';
import ScreenIntro from '@/src/components/ScreenIntro';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileIndex() {
  const insets = useSafeAreaInsets();
  return (
    <AppBackground>
      <View
        style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, flex: 1 }}
      >
        <ScreenIntro title="Profile" />

        <ProfileInfoCard />
      </View>
    </AppBackground>
  );
}
