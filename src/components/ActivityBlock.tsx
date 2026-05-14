import { StyleSheet, View } from "react-native";
import ActivityBlockItem from "./ActivityBlickItem";
import {
  ActivityBuyOrder,
  ActivityDeposit,
  ActivityWithdrawal,
} from "../constants/images";
import { Colors } from "../constants/styles";

export default function ActivityBlock() {
  return (
    <View style={styles.container}>
      <ActivityBlockItem icon={ActivityDeposit} title="Deposit" />
      <ActivityBlockItem icon={ActivityWithdrawal} title="Withdrawals" />
      <ActivityBlockItem icon={ActivityBuyOrder} title="Buy Order" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 12,
  },
});
