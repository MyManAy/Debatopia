import { Alert, Platform } from "react-native";

export default function (alertText: string) {
  if (Platform.OS === "web") {
    alert(alertText);
  } else {
    Alert.alert(alertText);
  }
}
