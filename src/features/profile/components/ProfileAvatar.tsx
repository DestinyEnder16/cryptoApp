import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

interface ProfileAvatarProps {
  name: string;
  size?: number;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

function ProfileAvatar({
  name,
  size = 122,
  fontSize = 42,
  backgroundColor = Colors.green,
  textColor = Colors.dark,
  style,
}: ProfileAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, backgroundColor },
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize, color: textColor }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
  initial: {
    fontFamily: Fonts.bold,
  },
});

export default ProfileAvatar;
