import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProfileRow } from "@/lib/supabase/types";

export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<ProfileRow | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}
