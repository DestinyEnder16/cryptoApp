import BackHeader from '@/src/components/BackHeader';
import { Fonts } from '@/src/constants/fonts';
import { ForwardBtn } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { useAppSelector } from '@/src/store/hooks';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type Details = {
  info: string;
  details: string;
};
export default function ProfileIndex() {
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);

  const userDetails: Details[] = [
    { info: 'Username', details: 'Not provided' },
    { info: 'Email', details: user?.email ?? 'Not provided' },
    { info: 'Mobile Number', details: user?.phone ?? 'Not provided' },
  ];

  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        flex: 1,
        backgroundColor: Colors.primaryBackgroundColor,
      }}
    >
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
              justifyContent: 'space-between',
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
              {user?.fullName}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.userDetails}>
        {userDetails.map((el, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.info}>{el.info}</Text>

            <Pressable
              onPress={() => router.navigate('/profile/edit')}
              style={[styles.row, { gap: 10 }]}
            >
              <Text style={styles.details}>{el.details}</Text>
              <ForwardBtn />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userDetails: {
    marginTop: 100,
    paddingHorizontal: 20,
    gap: 50,
  },
  info: {
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  details: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
  },
});
