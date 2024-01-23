import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { clientSupabase } from "../supabase/clientSupabase";
import { Session } from "@supabase/supabase-js";

export default function HomeLayout() {
  const [session, setSession] = useState(null as Session | null);
  useEffect(() => {
    clientSupabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    clientSupabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session && session.user) router.replace("/topicList/");
    else router.push("/auth/");
  }, [session]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Home" }} />
      <Stack.Screen
        name="topicList/index"
        options={{ headerTitle: "Topic List" }}
      />
      <Stack.Screen
        name="topicRoom/[topicRoomId]"
        options={{ headerTitle: "Topic Room" }}
      />
      <Stack.Screen
        name="thread/[threadId]"
        options={{ headerTitle: "Thread" }}
      />
      <Stack.Screen name="auth/index" />
      <Stack.Screen name="auth/signin" />
      <Stack.Screen name="auth/signup" />
    </Stack>
  );
}
