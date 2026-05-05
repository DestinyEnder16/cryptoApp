import BackHeader from '@/src/components/BackHeader';
import MenuIconsView from '@/src/components/MenuIconsView';
import { Fonts } from '@/src/constants/fonts';
import { ClipboardIcon, HomeMenuAvatar } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { useAppSelector } from '@/src/store/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Menu() {
  const insets = useSafeAreaInsets();
  const name = useAppSelector((state) => state.auth.user?.fullName);
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <LinearGradient
        colors={['#5ed5a716', Colors.primaryBackgroundColor]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        locations={[0, 0.4]}
        style={{
          width: '100%',
          overflow: 'hidden',
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <BackHeader txt="Menu" marginBottom={30} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <HomeMenuAvatar />
            <View style={{ gap: 5 }}>
              <Text style={{ color: Colors.text, fontFamily: Fonts.bold }}>
                {name}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={{ color: Colors.ash }}>ID: 1234567890</Text>

                <Pressable>
                  <ClipboardIcon />
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable
            style={{
              backgroundColor: Colors.green,
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 16,
            }}
          >
            <Text style={{ fontFamily: Fonts.regular }}>Edit Profile</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View
        style={{
          paddingTop: 30,
          paddingHorizontal: 15,
          flex: 1,
        }}
      >
        <MenuIconsView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundColor,
    flex: 1,
  },
});

export default Menu;
