import type { SleepEntry } from "./types";

export function computeSleepStats(entries: SleepEntry[]) {
  if (entries.length === 0) {
    return {
      totalNights: 0,
      avgDurationHours: 0,
      moodCounts: { terrible: 0, mal: 0, normal: 0, bien: 0, excelente: 0 },
      bestMood: null as "excelente" | "bien" | "normal" | "mal" | "terrible" | null,
    };
  }

  const totalDuration = entries.reduce((sum, e) => sum + e.durationHours, 0);
  const avgDuration = totalDuration / entries.length;

  const moodCounts = { terrible: 0, mal: 0, normal: 0, bien: 0, excelente: 0 };
  for (const entry of entries) {
    moodCounts[entry.mood]++;
  }

  let bestMood: "excelente" | "bien" | "normal" | "mal" | "terrible" | null = null;
  for (const mood of ["excelente", "bien", "normal", "mal", "terrible"] as const) {
    if (moodCounts[mood] > 0) {
      bestMood = mood;
      break;
    }
  }

  return {
    totalNights: entries.length,
    avgDurationHours: parseFloat(avgDuration.toFixed(1)),
    moodCounts,
    bestMood,
  };
}
