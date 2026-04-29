import SignInView from '@/src/components/SignInView';
import SignUpView from '@/src/components/SignUpView';
import SwitchSignMode from '@/src/components/SwitchSignMode';
import { Colors } from '@/src/constants/styles';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

export default function AuthIndex() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState(0);

  const goTo = (id: number) => {
    setActiveTab(id);
    scrollRef.current?.scrollTo({ x: id * width, animated: true });
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveTab(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={styles.container}>
      <SwitchSignMode view={activeTab} setView={goTo} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate={'fast'}
      >
        <SignInView />
        <SignUpView />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
  },
});
