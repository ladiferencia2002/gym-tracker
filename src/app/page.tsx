import Link from "next/link";

const FEATURES = [
  { emoji: "🔥", title: "Rachas que motivan", body: "Cuenta tus días seguidos entrenando y no dejes que se rompa la cadena." },
  { emoji: "📈", title: "Progreso visible", body: "Gráficos de peso, repeticiones, distancia y tiempo a lo largo del tiempo." },
  { emoji: "🗓️", title: "Resumen mensual", body: "Calorías, días activos y tendencias de cada mes, de un vistazo." },
  { emoji: "🔔", title: "Recordatorios", body: "Notificaciones diarias para no perder el hábito." },
  { emoji: "🔗", title: "Conecta Strava", body: "Sincroniza tus actividades automáticamente." },
  { emoji: "🏋️", title: "Todo tipo de ejercicio", body: "Correr, pesas, yoga, HIIT, natación, zumba y más." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Tu entrenamiento, tu racha
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">
            🔥 FitStreak
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Registra tus entrenamientos, mira tu progreso y mantén viva tu racha de días activos.
            Simple, motivador, y siempre a mano.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-400"
            >
              Empezar gratis
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-3xl">{f.emoji}</p>
              <h2 className="mt-3 font-semibold text-white">{f.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
