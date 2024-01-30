import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { clientSupabase } from "../supabase/clientSupabase";
import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "react-query";
import { Platform } from "react-native";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function HomeLayout() {
  const [session, setSession] = useState("loading" as Session | string | null);
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== undefined) {
      clientSupabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      document.title = "Lume Debate";
    }

    clientSupabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session === null) router.replace("/auth/");
  }, [session]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerBackTitleVisible: Platform.OS === "web" }}>
        <Stack.Screen name="index" options={{ headerTitle: "Home" }} />
        <Stack.Screen
          name="topicList/index"
          options={{ headerTitle: "Topic List" }}
        />
        <Stack.Screen
          name="topicRoom/[topicId]"
          options={{ headerTitle: "Topic Room" }}
        />
        <Stack.Screen name="thread/[threadId]" />
        <Stack.Screen
          name="auth/index"
          options={{ headerTitle: "Authenticate" }}
        />
        <Stack.Screen name="auth/login" options={{ headerTitle: "Log in" }} />
        <Stack.Screen name="auth/signup" options={{ headerTitle: "Sign up" }} />
      </Stack>
    </QueryClientProvider>
  );
}
