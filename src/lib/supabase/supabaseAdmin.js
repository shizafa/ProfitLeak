import { createClient } from "@supabase/supabase-js";

// Read the connection details from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Ceate the admin connection... ->full power, use only inside pages/api files
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);