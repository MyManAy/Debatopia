import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { adminSupabase } from "../supabase/AdminSupabase";
import { Session } from "@supabase/supabase-js";
import Auth from "../components/Auth";

export default function HomeLayout() {
  const [session, setSession] = useState(null as Session | null);
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await adminSupabase.auth.getSession();
      setSession(session);

      adminSupabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
      });
    })();
  }, []);
  return session ? <Stack /> : <Auth />;
}
