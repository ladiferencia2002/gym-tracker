import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { NotificationToggle } from "@/components/settings/NotificationToggle";
import { StravaPanel } from "@/components/settings/StravaPanel";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profile, { data: stravaConnection }] = await Promise.all([
    getProfile(supabase, user.id),
    supabase.from("strava_connections").select("last_synced_at").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ajustes</h1>
        <p className="text-sm text-slate-400">Tu perfil, notificaciones y conexiones.</p>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Perfil</h2>
        <ProfileForm displayName={profile?.display_name ?? ""} bodyWeightKg={profile?.body_weight_kg ?? 70} />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Notificaciones</h2>
        <NotificationToggle />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
          <span className="text-lg">🔗</span> Strava
        </h2>
        <StravaPanel connected={Boolean(stravaConnection)} lastSyncedAt={stravaConnection?.last_synced_at ?? null} />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 opacity-75">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <span className="text-lg">🍎</span> Apple Fitness
        </h2>
        <p className="text-sm text-slate-400">
          Apple no ofrece una API web pública para Apple Fitness / HealthKit — solo apps nativas de iOS pueden leer
          esos datos, así que no es posible conectarlo desde una app web. Puedes seguir registrando tus
          entrenamientos manualmente aquí.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 opacity-75">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <span className="text-lg">⌚</span> Realme Link
        </h2>
        <p className="text-sm text-slate-400">
          Realme no publica una API pública para Realme Link, así que tampoco se puede conectar directamente. Si tu
          reloj puede sincronizar tus entrenamientos a Strava automáticamente, esas actividades sí se importarán a
          través de la conexión de Strava de arriba.
        </p>
      </section>
    </div>
  );
}
