import { StyleSheet, View, Text, Image } from "react-native";
import { Link } from "expo-router";

export default function Auth() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Marketing/LumeLogo_White.png")}
        style={styles.logo}
      />

      <Link style={styles.signUpButton} href={"/auth/signup"}>
        <Text style={styles.buttonTextSIGNUP}>Sign Up</Text>
      </Link>

      <Link style={styles.logInButton} href={"/auth/signin"}>
        <Text style={styles.buttonTextSIGNIN}>Log In</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34", // Set a background color
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: "#00BF63", // Green color
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
  },
  logInButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: 200,
  },
  buttonTextSIGNUP: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonTextSIGNIN: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
});
