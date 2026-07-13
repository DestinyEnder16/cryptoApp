import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface ScreenIntroProps {
  title: string;
  description?: string;
  hasBackBtn?: boolean;
  onBack?: () => void;
}

export default function ScreenIntro({
  title,
  description,
  hasBackBtn,
  onBack,
}: ScreenIntroProps) {
  return (
    <View style={styles.container}>
      {hasBackBtn && (
        <Pressable
          hitSlop={30}
          onPress={() => (onBack ? onBack() : router.back())}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>
      )}
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  textGroup: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 24,
  },
  description: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#161C22',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
  },
  backBtnText: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: Fonts.medium,
  },
});
