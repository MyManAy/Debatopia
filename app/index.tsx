import { Redirect } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabOneScreen() {
  return <Redirect href={"/topicList/"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
});
