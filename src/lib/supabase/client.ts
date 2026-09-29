import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "./keys";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabasePublishableKey());
}
