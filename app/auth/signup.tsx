import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { clientSupabase } from "../../supabase/clientSupabase";
import { Button, Input } from "react-native-elements";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    if (!username) Alert.alert("You have not entered a username!");
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
        emailRedirectTo: "https://debatopia.vercel.app/email",
      },
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
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
          disabled={loading}
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
