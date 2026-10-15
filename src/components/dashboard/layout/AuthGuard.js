"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    supabase.auth.getUser(token).then(({ data, error }) => {
      if (data?.user && !error) {
        setChecking(false);
        return;
      }

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.replace("/login");
    });
  }, [router]);

  if (checking) {
    return null;
  }

  return children;
}
