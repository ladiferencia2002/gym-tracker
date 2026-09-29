import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./keys";
import type { Database } from "./types";

/**
 * Service-role client that bypasses Row Level Security. Only for trusted
 * server-side code that must read/write across users (e.g. the daily
 * reminder cron job). Never import this from a Client Component and never
 * send SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var.");
  }
  return createSupabaseClient<Database>(supabaseUrl(), key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
