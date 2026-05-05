import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { BackBtn } from '../constants/images';
import { Colors } from '../constants/styles';

interface HeaderProps {
  txt?: string;
  marginBottom: number;
}

function BackHeader({ txt, marginBottom }: HeaderProps) {
  return (
    <View style={[styles.container, { marginBottom }]}>
      <Pressable hitSlop={10} onPress={() => router.back()}>
        <BackBtn />
      </Pressable>

      {txt && <Text style={styles.txt}>{txt}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  txt: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
});

export default BackHeader;
