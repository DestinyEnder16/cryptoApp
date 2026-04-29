import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { BackBtn } from '../constants/images';
import { Colors } from '../constants/styles';

interface SwitchProps {
  view: number;
  setView: (id: number) => void;
}

export default function SwitchSignMode({ view, setView }: SwitchProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <BackBtn />
      </Pressable>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, view === 0 && styles.tabActive]}
          onPress={() => setView(0)}
        >
          <Text style={[styles.tabText, view === 0 && { color: '#C1C7CD' }]}>
            Sign In
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, view === 1 && styles.tabActive]}
          onPress={() => setView(1)}
        >
          <Text style={[styles.tabText, view === 1 && { color: '#C1C7CD' }]}>
            Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    marginTop: 50,
    marginHorizontal: 15,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    borderRadius: 12,
    backgroundColor: '#161C22',
    padding: 3,
  },
  tab: {
    width: '50%',
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primaryBackgroundColor,
  },
  tabText: {
    textAlign: 'center',
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
