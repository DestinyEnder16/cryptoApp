import Loader from '@/src/shared/components/Loader';
import NotificationBar from '@/src/features/notifications/components/NotificationBar';
import { Fonts } from '@/src/shared/constants/fonts';
import { NotificationEmptyIcon } from '@/src/shared/constants/images';
import { Colors } from '@/src/shared/constants/styles';
import { useFetchNotificationsQuery } from '@/src/features/notifications/store/notificationApi';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, Text, View } from 'react-native';

export default function Notifications() {
  const isFocused = useIsFocused();
  const { isLoading, data } = useFetchNotificationsQuery(undefined, {
    pollingInterval: isFocused ? 15000 : 0,
    skipPollingIfUnfocused: true,
  });
  const count = data?.meta.count ?? 0;

  return isLoading ? (
    <Loader />
  ) : (
    <View style={styles.body}>
      <View style={styles.container}>
        <NotificationBar length={count} />
        {count === 0 ? (
          <View style={styles.empty}>
            <NotificationEmptyIcon />
            <Text style={styles.mainTxt}>You have no notifications</Text>
            <Text style={styles.desc}>lorem ipsum lorem ipsum</Text>
          </View>
        ) : (
          <FlashList
            data={data?.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.body}</Text>
              </View>
            )}
          />
        )}
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
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 15,
  },
  mainTxt: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.text,
  },
  desc: {
    fontFamily: Fonts.medium,
    color: Colors.ash,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dotInactive,
    gap: 4,
  },
  itemTitle: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.text,
  },
  itemBody: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.lightTxt,
  },
});
