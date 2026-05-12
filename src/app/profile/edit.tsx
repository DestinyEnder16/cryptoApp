import ActionBtn from "@/src/components/ActionBtn";
import BackHeader from "@/src/components/BackHeader";
import { Fonts } from "@/src/constants/fonts";
import { ProfileCamera } from "@/src/constants/images";
import { Colors } from "@/src/constants/styles";
import { useAppSelector } from "@/src/store/hooks";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Details } from ".";
import { router } from "expo-router";

export default function EditProfile() {
  const insets = useSafeAreaInsets();

  const user = useAppSelector((state) => state.auth.user);

  const userDetails: Details[] = [
    { info: "Username", details: "Not yet defined" },
    { info: "Email", details: user?.email! },
    { info: "Mobile Number", details: user?.phone! },
  ];

  return (
    <View
      style={{
        backgroundColor: Colors.primaryBackgroundColor,
        flex: 1,
        paddingTop: insets.top + 10,
      }}
    >
      <LinearGradient
        colors={["#5ed5a716", Colors.primaryBackgroundColor]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        locations={[0, 0.4]}
        style={{ width: "100%" }}
      >
        <View style={{ height: 175 }}>
          <View style={{ marginLeft: 30 }}>
            <BackHeader txt="Profile" marginBottom={10} />
          </View>

          <View
            style={{
              position: "absolute",
              bottom: -90,
              alignSelf: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={require("@/assets/images/avatar.jpg")}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 100,
                }}
              />

              <View
                style={{
                  backgroundColor: "#203234",
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  position: "absolute",
                  right: -10,
                  bottom: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProfileCamera />
              </View>
            </View>

            <View style={{ alignItems: "center", gap: 8 }}>
              <Text style={styles.username}>
                {user?.fullName ?? "User1234"}
              </Text>
              <View style={styles.underline} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.userDetails}>
        {userDetails.map((el, index) => (
          <View key={index}>
            <Text style={styles.info}>{el.info}</Text>
            {/* <Text style={styles.details}>{el.details}</Text> */}
            <TextInput
              placeholder={el.details}
              placeholderTextColor={Colors.text}
            />
          </View>
        ))}
        <View
          style={{
            flexDirection: "row",
            // justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <ActionBtn
            text="Cancel"
            styles={{ backgroundColor: Colors.ash, txtColor: Colors.text }}
            action={() => router.back()}
            style={{ flex: 1 }}
          />
          <ActionBtn
            text="Save Changes"
            styles={{ backgroundColor: Colors.green, txtColor: Colors.dark }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  username: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  underline: {
    height: 1,
    width: 180,
    backgroundColor: Colors.text,
  },
  userDetails: {
    marginTop: 160,
    paddingHorizontal: 20,
    gap: 30,
  },
  info: {
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 6,
  },
  details: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
  },
});
