import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserClient } from "@/lib/supabase/getUserClient";
import { parseCostCsv } from "@/lib/costs/parseCostCsv";

const MAX_SIZE = 1 * 1024 * 1024; // 1 MB is plenty for a cost list
const MAX_ROWS = 5000;

async function handleUpload(request) {
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

  // 2. Get the file
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return Response.json({ error: "Only CSV files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File is too big (max 1 MB)" }, { status: 400 });
  }

  // 3. Read and check the CSV
  const text = await file.text();
  const { rows, errors, headerError } = parseCostCsv(text);

  if (headerError) {
    return Response.json({ error: headerError }, { status: 400 });
  }

  if (rows.length === 0) {
    return Response.json(
      {
        error: "No valid rows found in the file",
        skipped: errors.length,
        errors: errors.slice(0, 10),
      },
      { status: 400 }
    );
  }

  if (rows.length > MAX_ROWS) {
    return Response.json(
      { error: `Too many rows (max ${MAX_ROWS})` },
      { status: 400 }
    );
  }

  // 4. If the CSV has no product name, keep the name already saved for that SKU
  const { data: existing, error: existingError } = await db
    .from("product_costs")
    .select("sku, product_name")
    .eq("user_id", userId);

  if (existingError) {
    console.error("Load existing costs failed:", existingError);
    return Response.json({ error: "Could not load saved costs" }, { status: 500 });
  }

  const nameBySku = {};
  for (const e of existing ?? []) {
    nameBySku[String(e.sku).trim().toLowerCase()] = e.product_name ?? "";
  }

  const now = new Date().toISOString();

  const records = rows.map((r) => ({
    user_id: userId,
    sku: r.sku,
    product_name: r.product_name || nameBySku[r.sku] || "",
    cost_per_unit: r.cost_per_unit,
    updated_at: now,
  }));

  // 5. Insert new SKUs, update the ones that already exist
  const { error: saveError } = await db
    .from("product_costs")
    .upsert(records, { onConflict: "user_id,sku" });

  if (saveError) {
    console.error("Save costs failed:", saveError);
    return Response.json(
      { error: `Could not save the costs: ${saveError.message}` },
      { status: 500 }
    );
  }

  return Response.json(
    {
      saved: records.length,
      skipped: errors.length,
      errors: errors.slice(0, 10), // show at most 10 problems
    },
    { status: 200 }
  );
}

// Wrapper: any crash becomes a readable JSON error instead of a blank 500
export async function POST(request) {
  try {
    return await handleUpload(request);
  } catch (err) {
    console.error("Cost upload crashed:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}