import { cookies } from "next/headers";
import { supabase } from '@/lib/supabase/supabaseClient';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { createClient } from '@supabase/supabase-js';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-access-token')?.value;
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function PATCH(request) {
  // 1. Must be logged in
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2. Read the body safely
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { current_password, new_password } = body;

  // 3. Validate input
  if (!current_password || !new_password) {
    return Response.json(
      { error: "current_password and new_password are required" },
      { status: 400 }
    );
  }

  if (typeof new_password !== "string" || new_password.length < 6) {
    return Response.json(
      { error: "New password must be at least 6 characters" },
      { status: 400 }
    );
  }

  if (current_password === new_password) {
    return Response.json(
      { error: "New password must be different from the current one" },
      { status: 400 }
    );
  }

  // making temporary client to verify the current password

  const verifyClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { error: signInError } = await verifyClient.auth.signInWithPassword({
    email: user.email,
    password: current_password,
  });

  if (signInError) {
    return Response.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  // 5. Save the new password
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: new_password,
  });

  if (updateError) {
    return Response.json({ error: "Failed to update password" }, { status: 500 });
  }

  return Response.json({ message: "Password updated successfully" }, { status: 200 });
}