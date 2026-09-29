import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "./keys";
import type { Database } from "./types";

// Create a fresh client per request instead of a module-level singleton so
// this stays correct under Fluid Compute / concurrent requests.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render, where cookies can't be written.
          // Safe to ignore as long as the proxy is refreshing the session.
        }
      },
    },
  });
}
