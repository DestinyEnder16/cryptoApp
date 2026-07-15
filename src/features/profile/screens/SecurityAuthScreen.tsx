import AppBackground from '@/src/shared/components/AppBackground';
import AuthSetup from '@/src/features/profile/components/AuthSetup';
import DisableAuth from '@/src/features/profile/components/DisableAuth';
import { useFetchMeQuery } from '@/src/features/profile/store/profileApi';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

export default function SecurityAuthScreen() {
  const { data: user } = useFetchMeQuery();
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <AppBackground>
      <View
        style={{
          flex: 1,
          paddingBottom: tabBarHeight,
        }}
      >
        {twoFactorEnabled ? <DisableAuth /> : <AuthSetup />}
      </View>
    </AppBackground>
  );
}
