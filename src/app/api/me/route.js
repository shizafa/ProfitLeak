import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function GET() {
  // 1. Read the token from the cookie
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;

  if (!accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2. Ask Supabase whose token this is
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return Response.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  // 3. Look up this user's name in the users table
  // (uses the admin client because RLS on "users" blocks the anon client)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("full_name")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  // 4. Success
  return Response.json(
    { id: data.user.id, full_name: profile.full_name },
    { status: 200 }
  );
}