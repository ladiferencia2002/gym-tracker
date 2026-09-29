import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { TopNavLinks, BottomNavLinks } from "@/components/nav/NavLinks";
import { SignOutButton } from "@/components/nav/SignOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The proxy already redirects signed-out visitors; this is a defense-in-depth
  // check since Server Functions must not rely on proxy coverage alone.
  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);
  const name = profile?.display_name || user.email?.split("@")[0] || "Atleta";

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-white sm:pb-0">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span>🔥</span> FitStreak
          </Link>
          <TopNavLinks />
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-400 sm:inline">Hola, {name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>

      <BottomNavLinks />
    </div>
  );
}
