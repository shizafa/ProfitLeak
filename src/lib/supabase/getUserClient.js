import { createClient } from "@supabase/supabase-js";

// A Supabase client that sends the user's token, so RLS sees who they are
export function getUserClient(accessToken) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
}