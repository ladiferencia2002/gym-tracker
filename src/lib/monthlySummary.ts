import type { ExerciseRow } from "@/lib/supabase/types";

export type TypeTotal = {
  type: string;
  sessions: number;
  calories: number;
  percent: number;
};

export type MonthlySummary = {
  totalSessions: number;
  totalCalories: number;
  activeDays: number;
  totalMinutes: number;
  byType: TypeTotal[];
  caloriesTrendPercent: number | null;
};

export function computeMonthlySummary(
  monthExercises: ExerciseRow[],
  previousMonthExercises: ExerciseRow[]
): MonthlySummary {
  const totalSessions = monthExercises.length;
  const totalCalories = monthExercises.reduce((acc, e) => acc + e.calories, 0);
  const totalMinutes = monthExercises.reduce((acc, e) => acc + e.duration_minutes, 0);
  const activeDays = new Set(monthExercises.map((e) => e.performed_on)).size;

  const totalsByType = new Map<string, { sessions: number; calories: number }>();
  for (const e of monthExercises) {
    const entry = totalsByType.get(e.type) ?? { sessions: 0, calories: 0 };
    entry.sessions += 1;
    entry.calories += e.calories;
    totalsByType.set(e.type, entry);
  }

  const byType: TypeTotal[] = [...totalsByType.entries()]
    .map(([type, t]) => ({
      type,
      sessions: t.sessions,
      calories: t.calories,
      percent: totalCalories > 0 ? (t.calories / totalCalories) * 100 : 0,
    }))
    .sort((a, b) => b.calories - a.calories);

  const previousCalories = previousMonthExercises.reduce((acc, e) => acc + e.calories, 0);
  const caloriesTrendPercent =
    previousCalories > 0 ? ((totalCalories - previousCalories) / previousCalories) * 100 : null;

  return { totalSessions, totalCalories, activeDays, totalMinutes, byType, caloriesTrendPercent };
}
