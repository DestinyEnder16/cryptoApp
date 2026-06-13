import AppBackground from '@/src/components/AppBackground';
import AuthSetup from '@/src/components/AuthSetup';
import DisableAuth from '@/src/components/DisableAuth';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

export default function Auth() {
  const { data: user } = useFetchMeQuery();
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <AppBackground>
      <View
        style={{
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
