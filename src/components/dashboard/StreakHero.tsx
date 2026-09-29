import { isMilestone, nextMilestone, type StreakResult } from "@/lib/streak";

function motivationalMessage(streak: StreakResult, loggedToday: boolean): string {
  if (streak.current === 0) return "Hoy es un gran día para empezar una racha nueva 💪";
  if (isMilestone(streak.current)) return `¡${streak.current} días! Racha destacada 🏆`;
  if (!loggedToday) return "Aún no registras hoy — no dejes que se rompa la racha";
  const next = nextMilestone(streak.current);
  return next ? `Vas increíble. Faltan ${next - streak.current} días para ${next} 🔥` : "¡Sigue así, imparable! 🔥";
}

export function StreakHero({ streak, loggedToday }: { streak: StreakResult; loggedToday: boolean }) {
  const isCelebrating = streak.current > 0 && isMilestone(streak.current);

  return (
    <div
      className={`rounded-3xl border p-6 text-center ${
        isCelebrating
          ? "border-orange-500 bg-gradient-to-br from-orange-500/20 to-amber-500/10"
          : "border-slate-800 bg-slate-900/60"
      }`}
    >
      <p className="text-6xl">{streak.current > 0 ? "🔥" : "💤"}</p>
      <p className="mt-2 text-5xl font-extrabold text-white">{streak.current}</p>
      <p className="text-sm font-medium uppercase tracking-widest text-orange-400">
        {streak.current === 1 ? "día seguido" : "días seguidos"}
      </p>
      <p className="mt-3 text-slate-300">{motivationalMessage(streak, loggedToday)}</p>
      {streak.longest > streak.current && (
        <p className="mt-2 text-xs text-slate-500">Tu mejor racha: {streak.longest} días</p>
      )}
    </div>
  );
}
