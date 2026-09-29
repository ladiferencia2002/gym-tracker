import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { stravaAuthorizeUrl, STRAVA_STATE_COOKIE } from "@/lib/strava";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const state = randomBytes(16).toString("hex");
  const redirectUri = new URL("/api/strava/callback", request.url).toString();

  const response = NextResponse.redirect(stravaAuthorizeUrl(redirectUri, state));
  response.cookies.set(STRAVA_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
