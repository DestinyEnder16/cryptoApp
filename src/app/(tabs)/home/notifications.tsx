import Loader from "@/src/components/Loader";
import NotificationBar from "@/src/components/NotificationBar";
import ScreenHeader from "@/src/components/ScreenHeader";
import { Fonts } from "@/src/constants/fonts";
import {
  NotificationEmptyIcon,
  NotificationIconRain,
} from "@/src/constants/images";
import { Colors } from "@/src/constants/styles";
import { useFetchNotificationsQuery } from "@/src/store/api/Api";
import { StyleSheet, Text, View } from "react-native";

export default function Notifications() {
  const { isLoading, data } = useFetchNotificationsQuery();
  const count = data?.meta.count;

  return isLoading ? (
    <Loader />
  ) : (
    <View style={[styles.body]}>
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
