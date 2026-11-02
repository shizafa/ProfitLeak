import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile, error } = await supabaseAdmin
    .from("users")
    .select("full_name, phone, city, country")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  return Response.json({ id: user.id, email: user.email, ...profile }, { status: 200 });
}

export async function PATCH(request) {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { full_name, phone, city, country } = await request.json();

  const { error } = await supabaseAdmin
    .from("users")
    .update({ full_name, phone, city, country })
    .eq("id", user.id);

  if (error) {
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return Response.json({ message: "Profile updated successfully" }, { status: 200 });
}


