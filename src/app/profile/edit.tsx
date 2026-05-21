import ActionBtn from '@/src/components/ActionBtn';
import BackHeader from '@/src/components/BackHeader';
import ProfileField from '@/src/components/ProfileField';
import { Fonts } from '@/src/constants/fonts';
import { ProfileCamera } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { useEditProfileMutation } from '@/src/store/api/Api';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setUser } from '@/src/store/slices/authSlice';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfile() {
  const insets = useSafeAreaInsets();

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { focus } = useLocalSearchParams<{ focus?: string }>();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [username, setUsername] = useState(user?.fullName.split(' ')[0] ?? '');

  const inputRefs = useRef<Record<string, TextInput | null>>({});

  const [editProfile, { isLoading }] = useEditProfileMutation();

  useEffect(() => {
    if (focus && inputRefs.current[focus]) {
      inputRefs.current[focus]?.focus();
    }
  }, [focus]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const updated = await editProfile({ fullName, phone, email }).unwrap();
      dispatch(setUser(updated));
      router.back();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={{
        backgroundColor: Colors.primaryBackgroundColor,
        flex: 1,
        paddingTop: insets.top + 10,
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
              bottom: -90,
              alignSelf: 'center',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{ position: 'relative' }}>
              <Image
                source={require('@/assets/images/avatar.jpg')}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 100,
                }}
              />

              <View
                style={{
                  backgroundColor: '#203234',
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  position: 'absolute',
                  right: -10,
                  bottom: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ProfileCamera />
              </View>
            </View>

            <View style={{ alignItems: 'center', gap: 8 }}>
              <TextInput
                style={styles.username}
                value={fullName}
                ref={(node) => {
                  inputRefs.current['fullName'] = node;
                }}
                onChangeText={setFullName}
              />

              <View style={styles.underline} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.userDetails}>
        <ProfileField
          ref={(node) => {
            inputRefs.current['Username'] = node;
          }}
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
        />
        <ProfileField
          ref={(node) => {
            inputRefs.current['Email'] = node;
          }}
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ProfileField
          ref={(node) => {
            inputRefs.current['Mobile Number'] = node;
          }}
          label="Mobile Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <ActionBtn
            text="Cancel"
            styles={{ backgroundColor: Colors.ash, txtColor: Colors.text }}
            action={() => router.back()}
            style={{ flex: 1 }}
          />
          <ActionBtn
            text="Save Changes"
            styles={{ backgroundColor: Colors.green, txtColor: Colors.dark }}
            action={handleSave}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  username: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
  underline: {
    height: 1,
    width: 180,
    backgroundColor: Colors.text,
  },
  userDetails: {
    marginTop: 160,
    paddingHorizontal: 20,
    gap: 30,
  },
});
