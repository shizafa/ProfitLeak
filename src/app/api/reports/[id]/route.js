import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserClient } from "@/lib/supabase/getUserClient";
import { buildReportResponse } from "@/lib/reports/loadReport";

// Loads one specific report (picked from the History dropdown), same shape as /api/reports/latest.
export async function GET(_request, { params }) {
  try {
    const { id } = await params;

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

    // 2. Find that report (scoped to this user, so no one can load another user's report by id)
    const { data: report, error: reportError } = await db
      .from("reports")
      .select("id, file_name, period_start, period_end, other_charges, created_at")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (reportError) {
      console.error("Load report failed:", reportError);
      return Response.json({ error: "Could not load the report" }, { status: 500 });
    }

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    // 3. Load the SKU rows + current costs, and build the report
    const { data: result, error: buildError } = await buildReportResponse(db, userId, report);

    if (buildError) {
      return Response.json({ error: buildError.message }, { status: buildError.status });
    }

    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error("Load report crashed:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}
