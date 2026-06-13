import AppBackground from '@/src/components/AppBackground';
import { LoadingIcon } from '@/src/components/LoadingSpinner';
import ScreenIntro from '@/src/components/ScreenIntro';
import { useGetDevicesQuery } from '@/src/store/api/devicesApi';
import { View } from 'react-native';

export default function Devices() {
  const { isLoading, data } = useGetDevicesQuery();

  if (isLoading) {
    return (
      <View style={{ alignItems: 'center' }}>
        <LoadingIcon />
      </View>
    );
  }

  return (
    <AppBackground>
      <View style={{ paddingHorizontal: 20 }}>
        <ScreenIntro
          title="Devices"
          description="Registered devices for push notification and session awareness."
        />
      </View>
    </AppBackground>
  );
}
