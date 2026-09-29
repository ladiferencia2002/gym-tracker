import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getExercisesSince, getRecentExercises } from "@/lib/data/exercises";
import { addDays, todayLocal } from "@/lib/dates";
import { computeDashboardStats } from "@/lib/stats";
import { StreakHero } from "@/components/dashboard/StreakHero";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ExerciseList } from "@/components/exercises/ExerciseList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = todayLocal();
  // 400 days is enough history to surface a meaningful "longest streak" without
  // the query growing unbounded as a user logs for years.
  const [exercisesForStats, recentExercises] = await Promise.all([
    getExercisesSince(supabase, user.id, addDays(today, -400)),
    getRecentExercises(supabase, user.id, 8),
  ]);

  const stats = computeDashboardStats(exercisesForStats, today);
  const loggedToday = exercisesForStats.some((e) => e.performed_on === today);

  return (
    <div className="space-y-6">
      <StreakHero streak={stats.streak} loggedToday={loggedToday} />

      <QuickStats
        sessionsThisWeek={stats.sessionsThisWeek}
        caloriesThisMonth={stats.caloriesThisMonth}
        activeDaysThisMonth={stats.activeDaysThisMonth}
      />

      <Link
        href="/log"
        className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 font-semibold text-white transition-colors hover:bg-orange-400"
      >
        ➕ Registrar entrenamiento
      </Link>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-1 text-sm font-semibold text-white">Actividad reciente</h2>
        <ExerciseList exercises={recentExercises} />
      </div>
    </div>
  );
}
