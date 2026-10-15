import { createClient } from "@supabase/supabase-js";

// Read the connection details from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create the connection and share it with other files
export const supabase = createClient(supabaseUrl, supabaseAnonKey);