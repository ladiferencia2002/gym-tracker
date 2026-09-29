import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip static files, images, and metadata files; run everywhere else so
    // the auth session cookie stays fresh and protected pages stay guarded.
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icon-|apple-touch-icon).*)",
  ],
};
