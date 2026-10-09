import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(request) {
  // The token comes in the header: Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "No token sent" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  // Tell Supabase to end this user's session
  const { error } = await supabaseAdmin.auth.admin.signOut(token);

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ message: "Logout successful" }, { status: 200 });
}