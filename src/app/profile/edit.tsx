import ActionBtn from '@/src/components/ActionBtn';
import AppKeyboardView from '@/src/components/AppKeyboardView';
import BackHeader from '@/src/components/BackHeader';
import ProfileField from '@/src/components/ProfileField';
import { Fonts } from '@/src/constants/fonts';
import { ProfileCamera } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { editProfileSchema } from '@/src/schemas/editProfileSchema';
import { useEditProfileMutation } from '@/src/store/api/Api';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setUser, setUsername } from '@/src/store/slices/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ProfileFormValues = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
};

export default function EditProfile() {
  const insets = useSafeAreaInsets();

  const user = useAppSelector((state) => state.auth.user);
  const storedUsername = useAppSelector((state) => state.auth.username);
  const dispatch = useAppDispatch();
  const { focus } = useLocalSearchParams<{ focus?: string }>();

  const inputRefs = useRef<Record<string, TextInput | null>>({});

  const [editProfile, { isLoading }] = useEditProfileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(editProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: user?.fullName ?? '',
      username: storedUsername ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  });

  const watchedFullName = useWatch({ control, name: 'fullName' });

  useEffect(() => {
    if (focus && inputRefs.current[focus]) {
      inputRefs.current[focus]?.focus();
    }
  }, [focus]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    try {
      const updated = await editProfile({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
      }).unwrap();
      dispatch(setUser(updated));
      dispatch(setUsername(values.username));
      router.back();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AppKeyboardView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: 'green' }}
        keyboardShouldPersistTaps="handled" // Ensures buttons work even if keyboard is active
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    <Text style={styles.username}>
                      {watchedFullName || 'User1234'}
                    </Text>
                    <View style={styles.underline} />
                  </View>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.userDetails}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <ProfileField
                    ref={(node) => {
                      inputRefs.current['Full Name'] = node;
                    }}
                    label="Full Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    error={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="username"
                render={({ field: { value, onChange, onBlur } }) => (
                  <ProfileField
                    ref={(node) => {
                      inputRefs.current['Username'] = node;
                    }}
                    label="Username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    error={errors.username?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <ProfileField
                    ref={(node) => {
                      inputRefs.current['Email'] = node;
                    }}
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="phone"
                render={({ field: { value, onChange, onBlur } }) => (
                  <ProfileField
                    ref={(node) => {
                      inputRefs.current['Mobile Number'] = node;
                    }}
                    label="Mobile Number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                  />
                )}
              />
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <ActionBtn
                  text="Cancel"
                  styles={{
                    backgroundColor: Colors.ash,
                    txtColor: Colors.text,
                  }}
                  action={() => router.back()}
                  style={{ flex: 1 }}
                />
                <ActionBtn
                  text={isLoading ? 'Saving...' : 'Save Changes'}
                  styles={{
                    backgroundColor: Colors.green,
                    txtColor: Colors.dark,
                  }}
                  action={handleSubmit(onSubmit)}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </AppKeyboardView>
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
