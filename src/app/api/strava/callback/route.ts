import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { exchangeStravaCode, STRAVA_STATE_COOKIE } from "@/lib/strava";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STRAVA_STATE_COOKIE)?.value;
  cookieStore.delete(STRAVA_STATE_COOKIE);

  if (error || !code || !state || state !== expectedState) {
    return NextResponse.redirect(`${origin}/settings?strava=error`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  try {
    const tokens = await exchangeStravaCode(code);
    await supabase.from("strava_connections").upsert({
      user_id: user.id,
      athlete_id: tokens.athlete?.id ?? null,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(tokens.expires_at * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Strava OAuth callback failed:", err);
    return NextResponse.redirect(`${origin}/settings?strava=error`);
  }

  return NextResponse.redirect(`${origin}/settings?strava=connected`);
}
