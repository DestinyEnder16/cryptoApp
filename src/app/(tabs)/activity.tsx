import ActivityBlock from "@/src/components/ActivityBlock";
import ScreenHeader from "@/src/components/ScreenHeader";
import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Activity() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScreenHeader variant="profile" />

      <View style={styles.content}>
        <ActivityBlock />

        <View style={styles.activityBlock}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundColor,
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  activityBlock: {
    marginTop: 30,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 20,
    color: Colors.text,
  },
});
