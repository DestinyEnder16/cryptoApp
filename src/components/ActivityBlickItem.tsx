import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";
import { Colors } from "../constants/styles";
import { ForwardBtn } from "../constants/images";
import { Fonts } from "../constants/fonts";

interface ItemProps {
  icon: React.FC<SvgProps>;
  title: string;
}

export default function ActivityBlockItem({ icon: Icon, title }: ItemProps) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.block}>
        <Icon />
        <Text style={styles.txt}>{title}</Text>
      </View>

      <ForwardBtn />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.primaryBackgroundColor,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  block: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  txt: {
    color: Colors.lightTxt,
    fontFamily: Fonts.regular,
  },
});
