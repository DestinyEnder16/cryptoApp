import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackHeader from '../components/BackHeader';

export default function Profile() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 10 }}>
      <BackHeader txt="Profile" marginBottom={10} />
    </View>
  );
}
