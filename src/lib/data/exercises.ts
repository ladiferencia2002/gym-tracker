import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ExerciseRow } from "@/lib/supabase/types";

export async function getRecentExercises(
  supabase: SupabaseClient<Database>,
  userId: string,
  limit = 8
): Promise<ExerciseRow[]> {
  const { data } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", userId)
    .order("performed_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getExercisesSince(
  supabase: SupabaseClient<Database>,
  userId: string,
  sinceDate: string
): Promise<ExerciseRow[]> {
  const { data } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", userId)
    .gte("performed_on", sinceDate)
    .order("performed_on", { ascending: true });
  return data ?? [];
}

export async function getExercisesInRange(
  supabase: SupabaseClient<Database>,
  userId: string,
  startDate: string,
  endDate: string
): Promise<ExerciseRow[]> {
  const { data } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", userId)
    .gte("performed_on", startDate)
    .lte("performed_on", endDate)
    .order("performed_on", { ascending: true });
  return data ?? [];
}

export async function getExistingExternalIds(
  supabase: SupabaseClient<Database>,
  userId: string,
  externalIds: string[]
): Promise<Set<string>> {
  if (externalIds.length === 0) return new Set();
  const { data } = await supabase
    .from("exercises")
    .select("external_id")
    .eq("user_id", userId)
    .in("external_id", externalIds);
  return new Set((data ?? []).map((r) => r.external_id).filter((id): id is string => id !== null));
}
