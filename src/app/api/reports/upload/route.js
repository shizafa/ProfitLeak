import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { parseReport } from "@/lib/amazon/parseReport";
import { summarizeBySku } from "@/lib/amazon/summarizeBySku";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

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

  // For now: show the per-SKU totals
  return Response.json({ products }, { status: 200 });
}