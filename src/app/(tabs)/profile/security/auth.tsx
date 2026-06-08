import AppBackground from '@/src/components/AppBackground';
import AuthSetup from '@/src/components/AuthSetup';
import DisableAuth from '@/src/components/DisableAuth';
import { usePadding } from '@/src/hooks/usePadding';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

export default function Auth() {
  const { data: user } = useFetchMeQuery();
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;
  const paddingTop = usePadding();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <AppBackground>
      <View
        style={{
          paddingTop,
          paddingHorizontal: 20,
          flex: 1,
          paddingBottom: tabBarHeight,
        }}
      >
        {twoFactorEnabled ? <DisableAuth /> : <AuthSetup />}
      </View>
    </AppBackground>
  );
}
