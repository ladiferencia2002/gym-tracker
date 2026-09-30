"use client";

import Link from "next/link";
import { useAppData } from "@/lib/useAppData";
import { deleteExercise } from "@/lib/mutations";
import { addDays, todayLocal } from "@/lib/dates";
import { computeDashboardStats } from "@/lib/stats";
import { StreakHero } from "@/components/dashboard/StreakHero";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ExerciseList } from "@/components/exercises/ExerciseList";

export default function DashboardPage() {
  const { data, setData, hydrated } = useAppData();
  const today = todayLocal();

  // 400 days is enough history for a meaningful "longest streak" without the
  // list growing unbounded forever.
  const relevantExercises = data.exercises.filter((e) => e.performedOn >= addDays(today, -400));
  const stats = computeDashboardStats(relevantExercises, today);
  const loggedToday = relevantExercises.some((e) => e.performedOn === today);

  const recentExercises = [...data.exercises]
    .sort((a, b) => (a.performedOn === b.performedOn ? b.createdAt.localeCompare(a.createdAt) : b.performedOn.localeCompare(a.performedOn)))
    .slice(0, 8);

  if (!hydrated) return null;

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
        <ExerciseList exercises={recentExercises} onDelete={(id) => deleteExercise(setData, id)} />
      </div>
    </div>
  );
}
