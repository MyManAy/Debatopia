import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { Database } from "../app/generated/types_db";

export const adminSupabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
