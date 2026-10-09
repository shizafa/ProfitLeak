import { supabase } from "@/lib/supabase/supabaseClient";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Ask Supabase to check the email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return Response.json({ error: "Wrong email or password" }, { status: 401 });
  }

  // Send back the tokens. The user keeps these to prove they are logged in.
  return Response.json(
    {
      message: "Login successful",
      user: { id: data.user.id, email: data.user.email },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
    { status: 200 }
  );
}