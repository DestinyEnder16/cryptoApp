import NotificationBar from "@/src/components/NotificationBar";
import ScreenHeader from "@/src/components/ScreenHeader";
import { Fonts } from "@/src/constants/fonts";
import {
  NotificationEmptyIcon,
  NotificationIconRain,
} from "@/src/constants/images";
import { Colors } from "@/src/constants/styles";
import { useFetchNotificationsQuery } from "@/src/store/api/Api";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const { isLoading, data } = useFetchNotificationsQuery();
  console.log(data);
  isLoading && console.log("loading");
  const count = data?.meta.count;

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={[styles.body, { paddingTop: insets.top + 10 }]}>
      <ScreenHeader variant="profile" />

      <View style={styles.container}>
        <NotificationBar length={Number(data?.meta.count)} />
        {count === undefined && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 15,
            }}
          >
            <NotificationEmptyIcon />
            <Text style={styles.mainTxt}>You have no notifications</Text>
            <Text style={styles.desc}>lorem ipsum lorem ipsum</Text>
          </View>
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
  mainTxt: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.text,
  },
  desc: {
    fontFamily: Fonts.medium,
    color: Colors.ash,
  },
});
