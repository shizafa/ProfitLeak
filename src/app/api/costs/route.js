import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserClient } from "@/lib/supabase/getUserClient";

async function handleSave(request) {
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

  // 2. Read and check the input
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const sku = String(body.sku ?? "").trim().toLowerCase();
  const productName = String(body.product_name ?? "").trim();
  const rawCost = String(body.cost_per_unit ?? "").replace(/[$,\s]/g, "");
  const cost = rawCost === "" ? NaN : Number(rawCost);

  if (!sku) {
    return Response.json({ error: "SKU is missing" }, { status: 400 });
  }

  if (isNaN(cost)) {
    return Response.json({ error: "Cost must be a number" }, { status: 400 });
  }

  if (cost < 0) {
    return Response.json({ error: "Cost can't be negative" }, { status: 400 });
  }

  // 3. Insert a new cost, or update the one that already exists for this SKU
  const { error: saveError } = await db.from("product_costs").upsert(
    {
      user_id: userId,
      sku,
      product_name: productName,
      cost_per_unit: cost,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,sku" }
  );

  if (saveError) {
    console.error("Save cost failed:", saveError);
    return Response.json(
      { error: `Could not save the cost: ${saveError.message}` },
      { status: 500 }
    );
  }

  return Response.json({ saved: true, sku, cost_per_unit: cost }, { status: 200 });
}

// Wrapper: any crash becomes a readable JSON error instead of a blank 500
export async function POST(request) {
  try {
    return await handleSave(request);
  } catch (err) {
    console.error("Save cost crashed:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}