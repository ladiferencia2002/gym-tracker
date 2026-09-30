"use client";

import { useAppData } from "@/lib/useAppData";
import { updateProfile } from "@/lib/mutations";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default function SettingsPage() {
  const { data, hydrated, setData } = useAppData();

  if (!hydrated) return null;

  const profile = data.profile;

  function handleProfileSave(displayName: string, bodyWeightKg: number) {
    updateProfile(setData, displayName, bodyWeightKg);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ajustes</h1>
        <p className="text-sm text-slate-400">Tu perfil y conexiones.</p>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Perfil</h2>
        <ProfileForm
          displayName={profile.displayName}
          bodyWeightKg={profile.bodyWeightKg}
          onSave={handleProfileSave}
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 opacity-75">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <span className="text-lg">🔗</span> Strava
        </h2>
        <p className="text-sm text-slate-400">
          Strava no está disponible en esta versión. Puedes seguir registrando tus entrenamientos manualmente aquí.
        </p>
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
          reloj puede sincronizar tus entrenamientos a Strava automáticamente, esas actividades sí se importarían a
          través de Strava (que ahora no está disponible).
        </p>
      </section>
    </div>
  );
}
