import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "./keys";
import type { Database } from "./types";

// "/api/cron" is called server-to-server by Vercel Cron (no browser session) and
// checks its own CRON_SECRET bearer token internally, so it must skip the
// cookie-based auth redirect here.
const PUBLIC_PATHS = ["/login", "/signup", "/auth", "/api/cron"];

// Refreshes the Supabase session cookie on every navigation and redirects
// signed-out visitors away from protected pages. Runs in src/proxy.ts.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getClaims() verifies the token's signature; unlike getSession(), it can be
  // trusted here. Keep it directly after createServerClient with no code in between.
  const { data } = await supabase.auth.getClaims();
  const isAuthed = Boolean(data?.claims);

  const isPublicPath = PUBLIC_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!isAuthed && !isPublicPath && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const isEntryPath =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup" ||
    request.nextUrl.pathname === "/";

  if (isAuthed && isEntryPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
