import BackHeader from '@/src/components/BackHeader';
import { Fonts } from '@/src/constants/fonts';
import { ClipboardIcon, HomeMenuAvatar } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { useAppSelector } from '@/src/store/hooks';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MenuHeader() {
  const name = useAppSelector((state) => state.auth.user?.fullName);
  const userId = useAppSelector((state) => state.auth.user?.id!);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(userId);
  };

  return (
    <LinearGradient
      colors={['#5ed5a716', Colors.primaryBackgroundColor]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      locations={[0, 0.4]}
      style={styles.gradient}
    >
      <BackHeader txt="Menu" marginBottom={30} />

      <View style={styles.row}>
        <View style={styles.profile}>
          <HomeMenuAvatar />
          <View style={{ gap: 5 }}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.idRow}>
              <Text style={{ color: Colors.ash }}>ID: {userId}</Text>

              <Pressable onPress={copyToClipboard}>
                <ClipboardIcon />
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable style={styles.editBtn}>
          <Text style={{ fontFamily: Fonts.regular }}>Edit Profile</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    gap: 10,
  },
  name: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  idRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    backgroundColor: Colors.green,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
});
