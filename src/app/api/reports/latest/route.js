import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserClient } from "@/lib/supabase/getUserClient";
import { buildReport } from "@/lib/amazon/buildReport";

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

    // 3. Load the SKU rows of that report
    const { data: products, error: productsError } = await db
      .from("report_results")
      .select("sku, product_name, units_sold, refund_count, revenue, amazon_fees")
      .eq("report_id", report.id)
      .eq("user_id", userId);

    if (productsError) {
      console.error("Load results failed:", productsError);
      return Response.json({ error: "Could not load the report results" }, { status: 500 });
    }

    // 4. Load the CURRENT product costs (so costs added later are included)
    const { data: costs, error: costsError } = await db
      .from("product_costs")
      .select("sku, cost_per_unit")
      .eq("user_id", userId);

    if (costsError) {
      console.error("Load costs failed:", costsError);
      return Response.json({ error: "Could not load product costs" }, { status: 500 });
    }

    // 5. Same calculation as the upload route
    const result = buildReport(products ?? [], report.other_charges ?? [], costs ?? []);

    return Response.json(
      {
        ...result,
        report_id: report.id,
        file_name: report.file_name,
        period_start: report.period_start,
        period_end: report.period_end,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Latest report crashed:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}