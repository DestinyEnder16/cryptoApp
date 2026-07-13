import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

interface ProfileStripItemProps {
  title: string;
  subtitle: string;
  badge?: string | number;
  danger?: boolean;
  onPress?: () => void;
}

function ProfileStripItem({
  title,
  subtitle,
  badge,
  danger = false,
  onPress,
}: ProfileStripItemProps) {
  const showBadge = Boolean(badge);
  const accentColor = danger ? Colors.red : Colors.green;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: accentColor }]} />

      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {showBadge && (
        <Text style={[styles.badge, { color: accentColor }]}>{badge}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: Colors.green,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  subtitle: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  badge: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
});

export default ProfileStripItem;
