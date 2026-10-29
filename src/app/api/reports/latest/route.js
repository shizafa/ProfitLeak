import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserClient } from "@/lib/supabase/getUserClient";
import { buildReportResponse } from "@/lib/reports/loadReport";

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

    // 2. Find this user's newest report
    const { data: report, error: reportError } = await db
      .from("reports")
      .select("id, file_name, period_start, period_end, other_charges, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (reportError) {
      console.error("Load report failed:", reportError);
      return Response.json({ error: "Could not load the report" }, { status: 500 });
    }

    // No report uploaded yet: not an error, just nothing to show
    if (!report) {
      return Response.json({ empty: true }, { status: 200 });
    }

    // 3. Load the SKU rows + current costs, and build the report
    const { data: result, error: buildError } = await buildReportResponse(db, userId, report);

    if (buildError) {
      return Response.json({ error: buildError.message }, { status: buildError.status });
    }

    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error("Latest report crashed:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}