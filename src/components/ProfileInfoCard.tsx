import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/authSlice';
import ProfileAvatar from './ProfileAvatar';

export default function ProfileInfoCard() {
  const user = useAppSelector(selectUser);
  const isEmailVerified = user?.emailVerified;
  return (
    <View style={styles.card}>
      <ProfileAvatar name={user?.fullName ?? 'User'} size={74} fontSize={32} />

      <View style={{ gap: 10 }}>
        <Text style={styles.name}>{user?.fullName ?? 'PERSONAL'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Pressable
          style={[
            isEmailVerified
              ? { backgroundColor: Colors.lime }
              : { backgroundColor: Colors.error },
            styles.emailField,
          ]}
        >
          <Text
            style={[
              isEmailVerified ? { color: Colors.green } : { color: Colors.red },
              styles.emailTxt,
            ]}
          >
            {isEmailVerified ? 'Verified' : 'Unverified'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 50,
    flexDirection: 'row',
    gap: 10,
  },
  name: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
  },
  email: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  emailTxt: {
    fontFamily: Fonts.bold,
    fontSize: 10,
  },
  emailField: {
    width: 100,
    alignItems: 'center',
    borderRadius: 13,
    paddingVertical: 5,
  },
});
