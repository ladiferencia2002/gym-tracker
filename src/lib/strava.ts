import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ExerciseInsert, StravaConnectionRow } from "@/lib/supabase/types";
import { STRAVA_TYPE_MAP } from "@/lib/exerciseTypes";
import { estimateCalories } from "@/lib/calories";
import { toLocalISODate } from "@/lib/dates";

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

export const STRAVA_STATE_COOKIE = "strava_oauth_state";

export function stravaAuthorizeUrl(redirectUri: string, state: string): string {
  const clientId = process.env.STRAVA_CLIENT_ID;
  if (!clientId) throw new Error("Missing STRAVA_CLIENT_ID env var.");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    approval_prompt: "auto",
    scope: "activity:read_all",
    state,
  });
  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  athlete?: { id: number };
};

export async function exchangeStravaCode(code: string): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Strava token exchange failed: ${res.status}`);
  return res.json();
}

async function refreshStravaToken(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Strava token refresh failed: ${res.status}`);
  return res.json();
}

/** Returns a valid access token, refreshing (and persisting) it if it's expired or close to it. */
export async function getValidStravaToken(
  supabase: SupabaseClient<Database>,
  connection: StravaConnectionRow
): Promise<string> {
  const expiresAt = new Date(connection.expires_at).getTime();
  const isExpiringSoon = expiresAt - Date.now() < 5 * 60 * 1000;
  if (!isExpiringSoon) return connection.access_token;

  const refreshed = await refreshStravaToken(connection.refresh_token);
  await supabase
    .from("strava_connections")
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: new Date(refreshed.expires_at * 1000).toISOString(),
    })
    .eq("user_id", connection.user_id);

  return refreshed.access_token;
}

type StravaActivity = {
  id: number;
  name: string;
  type: string;
  sport_type?: string;
  distance: number; // meters
  moving_time: number; // seconds
  start_date_local: string; // ISO
};

export async function fetchRecentStravaActivities(
  accessToken: string,
  afterUnixSeconds: number
): Promise<StravaActivity[]> {
  const params = new URLSearchParams({ after: String(afterUnixSeconds), per_page: "50" });
  const res = await fetch(`${ACTIVITIES_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Strava activities fetch failed: ${res.status}`);
  return res.json();
}

/**
 * Strava's summary activity list doesn't reliably include calories (it depends
 * on sport type and athlete gear), so we estimate them the same way as manual
 * entries for consistency instead of trusting a sometimes-missing field.
 */
export function mapStravaActivity(activity: StravaActivity, userId: string, bodyWeightKg: number): ExerciseInsert {
  const type = STRAVA_TYPE_MAP[activity.sport_type ?? activity.type] ?? "other";
  const durationMinutes = Math.max(1, Math.round(activity.moving_time / 60));
  const distanceKm = activity.distance > 0 ? Math.round((activity.distance / 1000) * 100) / 100 : null;

  return {
    user_id: userId,
    type,
    performed_on: toLocalISODate(new Date(activity.start_date_local)),
    duration_minutes: durationMinutes,
    distance_km: distanceKm,
    weight_kg: null,
    reps: null,
    sets: null,
    calories: estimateCalories(type, durationMinutes, bodyWeightKg),
    notes: activity.name || null,
    source: "strava",
    external_id: String(activity.id),
  };
}
