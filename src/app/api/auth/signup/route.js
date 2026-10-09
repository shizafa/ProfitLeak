import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(request) {
  // Get the data sent by the user
  const { email, password, full_name } = await request.json();

  // Check that the user sent what we need
  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return Response.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  // Step 1: create the user in Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // skips the confirmation email, easier for testing
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  // Step 2: save the user in our own "users" table, using the same id
  const { error: insertError } = await supabaseAdmin.from("users").insert({
    id: data.user.id,
    email: email,
    full_name: full_name,
  });

  if (insertError) {
    // Undo step 1 so we don't leave a half-created user
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  return Response.json(
    {
      message: "Signup successful",
      user: { id: data.user.id, email: email },
    },
    { status: 201 }
  );
}