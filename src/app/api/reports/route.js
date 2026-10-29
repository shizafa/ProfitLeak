import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserClient } from "@/lib/supabase/getUserClient";

// Lists this user's reports (newest first), for the History dropdown.
export async function GET() {
  try {
    // 1. Check the user is logged in
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (!accessToken) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return Response.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const userId = data.user.id;
    const db = getUserClient(accessToken); // acts as the logged-in user (RLS)

    // 2. List this user's reports, newest first
    const { data: reports, error: reportsError } = await db
      .from("reports")
      .select("id, file_name, period_start, period_end, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (reportsError) {
      console.error("List reports failed:", reportsError);
      return Response.json({ error: "Could not load the reports" }, { status: 500 });
    }

    return Response.json({ reports: reports ?? [] }, { status: 200 });
  } catch (err) {
    console.error("List reports crashed:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}
