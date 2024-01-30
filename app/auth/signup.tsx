import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { clientSupabase } from "../../supabase/clientSupabase";
import { Button, Input } from "react-native-elements";
import crossPlatformAlert from "../../utils/crossPlatformAlert";
import { router } from "expo-router";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    document.title = "Login";
  }, [navigation]);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await clientSupabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username,
        },
        emailRedirectTo:
          Platform.OS === "web"
            ? "https://lumedebate.com/" // directly to website on web
            : "https://emailconfirmation.lumedebate.com/", // email confirmation site on mobile
      },
    });

    if (error) crossPlatformAlert(error.message);
    if (!session && !error) {
      // success
      crossPlatformAlert("Please check your inbox for email verification!");
      router.push("/auth/login");
    }
    setLoading(false);
  }

  return (
    <View style={InputStyles.container}>
      <View style={[InputStyles.verticallySpaced, InputStyles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[InputStyles.verticallySpaced]}>
        <Input
          label="Username"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Username"
          autoCapitalize={"none"}
        />
      </View>
      <View style={InputStyles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={InputStyles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading || !username || !password || !email}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

const InputStyles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
