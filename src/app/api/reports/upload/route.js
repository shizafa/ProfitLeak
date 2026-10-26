import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { parseReport } from "@/lib/amazon/parseReport";
import { summarizeBySku } from "@/lib/amazon/summarizeBySku";
import { calculateProfit } from "@/lib/amazon/calculateProfit";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

function round2(n) {
  return Math.round(n * 100) / 100;
}

export async function POST(request) {
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

  // 5. Add up the numbers per SKU
  const products = summarizeBySku(rows);

  // 6. Load this user's saved product costs
  const { data: costs, error: costsError } = await supabase
    .from("product_costs")
    .select("sku, cost_per_unit")
    .eq("user_id", data.user.id); // change "user_id" if your column is named differently

  if (costsError) {
    return Response.json({ error: "Could not load product costs" }, { status: 500 });
  }

  // 7. Calculate profit per SKU
  const { results, missingCosts } = calculateProfit(products, costs ?? []);

  // 8. Totals for the summary cards
  const totals = {
    profit: round2(results.reduce((sum, r) => sum + r.profit, 0)),
    units: products.reduce((sum, p) => sum + p.units_sold, 0),
    fees: round2(products.reduce((sum, p) => sum + p.amazon_fees, 0)),
    revenue: round2(products.reduce((sum, p) => sum + p.revenue, 0)),
  };

  return Response.json({ results, missingCosts, totals }, { status: 200 });
}