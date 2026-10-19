import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;

  if (!token) {
    return Response.json({ error: "No session found" }, { status: 401 });
  }

  // Tell Supabase to end this user's session
  const { error } = await supabaseAdmin.auth.admin.signOut(token);

  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ message: "Logout successful" }, { status: 200 });
}