import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { parseReport } from "@/lib/amazon/parseReport";
import { summarizeBySku, summarizeOtherCharges } from "@/lib/amazon/summarizeBySku";
import { buildReport } from "@/lib/amazon/buildReport";
import { getUserClient } from "@/lib/supabase/getUserClient";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

// Find the first and last date in the report (returns null if the dates can't be read)
function getPeriod(rows) {
  const times = rows
    .map((r) => new Date(r["date/time"]).getTime())
    .filter((t) => !isNaN(t));

  if (times.length === 0) return { start: null, end: null };

  const toDate = (t) => new Date(t).toISOString().slice(0, 10); // "2026-10-01"
  return { start: toDate(Math.min(...times)), end: toDate(Math.max(...times)) };
}

export async function POST(request) {
  // 1. Check the user is logged in
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;

  if (!accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  const { data, error } = await db.auth.getUser(accessToken);

  if (error || !data.user) {
    return Response.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const userId = data.user.id;
  const db = getUserClient(accessToken);

  // 2. Get the file from the form data
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  // 3. Check type and size
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return Response.json({ error: "Only CSV files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File is too big (max 5 MB)" }, { status: 400 });
  }

  // 4. Read the report
  const text = await file.text();
  const rows = parseReport(text);

  if (rows === null) {
    return Response.json(
      { error: "This doesn't look like an Amazon Transaction report" },
      { status: 400 }
    );
  }

  if (rows.length === 0) {
    return Response.json({ error: "The report has no data rows" }, { status: 400 });
  }

  // 5. Add up the numbers per SKU, and the rows that have no SKU
  const products = summarizeBySku(rows);
  const otherCharges = summarizeOtherCharges(rows);

  // 6. Load this user's saved product costs
  const { data: costs, error: costsError } = await db
    .from("product_costs")
    .select("sku, cost_per_unit")
    .eq("user_id", userId);

  if (costsError) {
    return Response.json({ error: "Could not load product costs" }, { status: 500 });
  }

  // 7. Calculate everything (same function the "latest report" route will use)
  const report = buildReport(products, otherCharges, costs ?? []);

  // 8. Save the report
  const period = getPeriod(rows);

  const { data: savedReport, error: reportError } = await db
    .from("reports")
    .insert({
      user_id: userId,
      file_name: file.name,
      period_start: period.start,
      period_end: period.end,
      row_count: rows.length,
      status: "completed",
      total_profit: report.totals.skus_with_cost > 0 ? report.totals.profit : null,
      other_charges: otherCharges,
    })
    .select("id")
    .single();

  if (reportError) {
    console.error("Save report failed:", reportError);
    return Response.json(
      { error: `Could not save the report: ${reportError.message}` },
      { status: 500 }
    );
  }

  // 9. Save one row per SKU (only the base numbers; the rest is recalculated on load)
  const resultRows = products.map((p) => ({
    report_id: savedReport.id,
    user_id: userId,
    sku: p.sku,
    product_name: p.product_name,
    units_sold: p.units_sold,
    refund_count: p.refund_count,
    revenue: p.revenue,
    amazon_fees: p.amazon_fees,
  }));

  if (resultRows.length > 0) {
    const { error: resultsError } = await db
      .from("report_results")
      .insert(resultRows);

    if (resultsError) {
      console.error("Save results failed:", resultsError);
      // Remove the half-saved report so we don't keep an empty one
      await db.from("reports").delete().eq("id", savedReport.id);

      return Response.json(
        { error: `Could not save the results: ${resultsError.message}` },
        { status: 500 }
      );
    }
  }

  return Response.json({ ...report, report_id: savedReport.id }, { status: 200 });
}