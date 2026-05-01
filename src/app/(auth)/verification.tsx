import BackHeader from '@/src/components/BackHeader';
import { AuthStyles } from '@/src/components/SignInView';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Verification() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <BackHeader txt="Verification" marginBottom={30} />

      <Text style={AuthStyles.heading}>Enter your code</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
