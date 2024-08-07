import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { clientSupabase } from "../../supabase/clientSupabase";
import { Button, Input } from "react-native-elements";
import crossPlatformAlert from "../../utils/crossPlatformAlert";
import { router } from "expo-router";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = "Login";
    }
  }, [navigation]);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await clientSupabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) crossPlatformAlert(error.message);
    if (!error) router.replace("/topicList/");
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
      <View style={[InputStyles.verticallySpaced, InputStyles.mt20]}>
        <Button
          title="Log in"
          disabled={loading || !email || !password}
          onPress={() => signInWithEmail()}
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
