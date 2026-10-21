import { cookies } from "next/headers";
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

  // Store the tokens in httpOnly cookies so proxy.js can read them server-side.
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: data.session.expires_in,
  });
  cookieStore.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  });

  return Response.json(
    {
      message: "Login successful",
      user: { id: data.user.id, email: data.user.email },
    },
    { status: 200 }
  );
}