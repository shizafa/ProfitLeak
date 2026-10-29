import { buildReport } from "@/lib/amazon/buildReport";

// report: the row from "reports" ({ id, file_name, period_start, period_end, other_charges })
// Loads that report's SKU rows + the user's current costs, then runs buildReport.
// Returns { data } on success or { error: { status, message } } on failure.
export async function buildReportResponse(db, userId, report) {
  const { data: products, error: productsError } = await db
    .from("report_results")
    .select("sku, product_name, units_sold, refund_count, revenue, amazon_fees")
    .eq("report_id", report.id)
    .eq("user_id", userId);

  if (productsError) {
    console.error("Load results failed:", productsError);
    return { error: { status: 500, message: "Could not load the report results" } };
  }

  // Current costs, not the costs at upload time, so edits are reflected everywhere
  const { data: costs, error: costsError } = await db
    .from("product_costs")
    .select("sku, cost_per_unit")
    .eq("user_id", userId);

  if (costsError) {
    console.error("Load costs failed:", costsError);
    return { error: { status: 500, message: "Could not load product costs" } };
  }

  const result = buildReport(products ?? [], report.other_charges ?? [], costs ?? []);

  return {
    data: {
      ...result,
      report_id: report.id,
      file_name: report.file_name,
      period_start: report.period_start,
      period_end: report.period_end,
    },
  };
}
