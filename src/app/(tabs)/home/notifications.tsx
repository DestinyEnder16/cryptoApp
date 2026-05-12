import NotificationBar from '@/src/components/NotificationBar';
import ScreenHeader from '@/src/components/ScreenHeader';
import { Colors } from '@/src/constants/styles';
import { useFetchNotificationsQuery } from '@/src/store/api/Api';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const { isLoading, data } = useFetchNotificationsQuery();
  console.log(data);
  isLoading && console.log('loading');

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={[styles.body, { paddingTop: insets.top + 10 }]}>
      <ScreenHeader variant="profile" />

      <View style={styles.container}>
        <NotificationBar length={Number(data?.meta.count)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.primaryBackgroundColor,
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
  },
});
