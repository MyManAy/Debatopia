import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { clientSupabase } from "../supabase/clientSupabase";
import { Session } from "@supabase/supabase-js";
import Auth from "../components/Auth";

export default function HomeLayout() {
  const [session, setSession] = useState(null as Session | null);
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await clientSupabase.auth.getSession();
      setSession(session);

      clientSupabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
      });
    })();
  }, []);
  return session && session.user ? (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Topic List" }} />
      <Stack.Screen name="chat" options={{ headerTitle: "Gifted Chat" }} />
      <Stack.Screen
        name="topicRoom/[topicRoomId]"
        options={{ headerTitle: "Topic Room" }}
      />
      <Stack.Screen
        name="thread/[threadId]"
        options={{ headerTitle: "Thread" }}
      />
    </Stack>
  ) : (
    <Auth />
  );
}
