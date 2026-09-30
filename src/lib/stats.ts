import type { ExerciseEntry } from "@/lib/types";
import { computeStreaks, type StreakResult } from "./streak";
import { startOfWeek } from "./dates";

export type DashboardStats = {
  streak: StreakResult;
  sessionsThisWeek: number;
  caloriesThisMonth: number;
  activeDaysThisMonth: number;
};

export function computeDashboardStats(exercises: ExerciseEntry[], today: string): DashboardStats {
  const dates = exercises.map((e) => e.performedOn);
  const streak = computeStreaks(dates, today);

  const weekStart = startOfWeek(today);
  const sessionsThisWeek = exercises.filter(
    (e) => e.performedOn >= weekStart && e.performedOn <= today
  ).length;

  const monthId = today.slice(0, 7);
  const thisMonthExercises = exercises.filter((e) => e.performedOn.slice(0, 7) === monthId);
  const caloriesThisMonth = thisMonthExercises.reduce((acc, e) => acc + e.calories, 0);
  const activeDaysThisMonth = new Set(thisMonthExercises.map((e) => e.performedOn)).size;

  return { streak, sessionsThisWeek, caloriesThisMonth, activeDaysThisMonth };
}
