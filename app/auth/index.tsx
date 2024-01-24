import { StyleSheet, View, Text, Image } from "react-native";
import { Link } from "expo-router";

export default function Auth() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/marketing/LumeIcon_WhiteText.png")}
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
    width: 300,
    height: 300,
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: "auto",
    marginTop: "auto",
  },
  signUpButton: {
    backgroundColor: "#00BF63", // Lume Green
    padding: 15,
    borderRadius: 10,
    width: 200,
    marginBottom: 20,
  },
  logInButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: 200,
    marginBottom: "auto",
  },
  buttonTextSIGNUP: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  buttonTextSIGNIN: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
});
