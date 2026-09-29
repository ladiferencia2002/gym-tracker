"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { getExistingExternalIds } from "@/lib/data/exercises";
import { fetchRecentStravaActivities, getValidStravaToken, mapStravaActivity } from "@/lib/strava";

const SYNC_LOOKBACK_DAYS = 30;

export type SyncResult = { imported: number; error: string | null };

export async function syncStravaActivities(): Promise<SyncResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { imported: 0, error: "No autenticado." };

  const { data: connection } = await supabase
    .from("strava_connections")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!connection) return { imported: 0, error: "Strava no está conectado." };

  try {
    const accessToken = await getValidStravaToken(supabase, connection);
    const after = Math.floor(Date.now() / 1000) - SYNC_LOOKBACK_DAYS * 24 * 60 * 60;
    const activities = await fetchRecentStravaActivities(accessToken, after);

    const profile = await getProfile(supabase, user.id);
    const bodyWeight = profile?.body_weight_kg ?? 70;

    const externalIds = activities.map((a) => String(a.id));
    const existing = await getExistingExternalIds(supabase, user.id, externalIds);
    const newRows = activities
      .filter((a) => !existing.has(String(a.id)))
      .map((a) => mapStravaActivity(a, user.id, bodyWeight));

    if (newRows.length > 0) {
      await supabase.from("exercises").insert(newRows);
    }

    await supabase
      .from("strava_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("user_id", user.id);

    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/summary");
    revalidatePath("/settings");

    return { imported: newRows.length, error: null };
  } catch (err) {
    console.error("Strava sync failed:", err);
    return { imported: 0, error: "No se pudo sincronizar con Strava. Intenta de nuevo." };
  }
}

export async function disconnectStrava(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado.");

  await supabase.from("strava_connections").delete().eq("user_id", user.id);
  revalidatePath("/settings");
}
