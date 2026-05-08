import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackHeader from '../components/BackHeader';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';
import { useAppSelector } from '../store/hooks';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.user);
  return (
    <View style={{ paddingTop: insets.top + 10, flex: 1 }}>
      <LinearGradient
        colors={['#5ed5a716', Colors.primaryBackgroundColor]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        locations={[0, 0.4]}
        style={{ width: '100%' }}
      >
        <View style={{ height: 175 }}>
          <View style={{ marginLeft: 30 }}>
            <BackHeader txt="Profile" marginBottom={10} />
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: -50,
              alignSelf: 'center',
              gap: 10,
            }}
          >
            <Image
              source={require('@/assets/images/avatar.jpg')}
              style={{
                width: 110,
                height: 110,
                borderRadius: 100,
              }}
            />
            <Text
              style={{
                color: Colors.text,
                fontSize: 18,
                fontFamily: Fonts.bold,
                textAlign: 'center',
              }}
            >
              {user.name}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
