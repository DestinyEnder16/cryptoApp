import { useAppSelector } from '@/src/store/hooks';
import { Text, View } from 'react-native';

export default function Welcome() {
  const user = useAppSelector((state) => state.user);
  return (
    <View>
      <Text>Welcome Back {user.name}</Text>
    </View>
  );
}
