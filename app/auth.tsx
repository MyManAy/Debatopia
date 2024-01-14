import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import Auth from "../components/Auth";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AUTH</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Auth />
    </View>
  );
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
  },
});
