"use client";

import { useState, useTransition } from "react";
import { disconnectStrava, syncStravaActivities } from "@/app/actions/strava";

export function StravaPanel({
  connected,
  lastSyncedAt,
}: {
  connected: boolean;
  lastSyncedAt: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function sync() {
    startTransition(async () => {
      const result = await syncStravaActivities();
      setMessage(result.error ?? `Listo: ${result.imported} actividades nuevas importadas.`);
    });
  }

  function disconnect() {
    startTransition(async () => {
      await disconnectStrava();
      setMessage(null);
    });
  }

  if (!connected) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-400">
          Conecta tu cuenta de Strava para importar tus actividades automáticamente.
        </p>
        <a
          href="/api/strava/connect"
          className="inline-block rounded-xl bg-[#fc4c02] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Conectar con Strava
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-emerald-400">✅ Strava conectado</p>
      <p className="text-xs text-slate-500">
        Última sincronización: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString("es") : "nunca"}
      </p>
      {message && <p className="text-sm text-slate-300">{message}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={sync}
          disabled={isPending}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
        >
          {isPending ? "Sincronizando…" : "Sincronizar ahora"}
        </button>
        <button
          type="button"
          onClick={disconnect}
          disabled={isPending}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          Desconectar
        </button>
      </div>
    </div>
  );
}
