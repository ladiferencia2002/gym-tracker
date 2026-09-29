import { addDays } from "./dates";

export type StreakResult = {
  current: number;
  longest: number;
};

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];

/**
 * `dates` are distinct "YYYY-MM-DD" days that had at least one logged
 * exercise. The current streak stays alive through "today" even if nothing
 * is logged yet today - it only breaks once a full day is skipped.
 */
export function computeStreaks(dates: string[], today: string): StreakResult {
  const uniqueSorted = [...new Set(dates)].sort();
  if (uniqueSorted.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueSorted.length; i++) {
    run = addDays(uniqueSorted[i - 1], 1) === uniqueSorted[i] ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const lastDate = uniqueSorted[uniqueSorted.length - 1];
  const yesterday = addDays(today, -1);
  if (lastDate !== today && lastDate !== yesterday) {
    return { current: 0, longest };
  }

  let current = 1;
  for (let i = uniqueSorted.length - 1; i > 0; i--) {
    if (addDays(uniqueSorted[i - 1], 1) === uniqueSorted[i]) {
      current += 1;
    } else {
      break;
    }
  }
  return { current, longest };
}

export function nextMilestone(current: number): number | null {
  return STREAK_MILESTONES.find((m) => m > current) ?? null;
}

export function isMilestone(current: number): boolean {
  return STREAK_MILESTONES.includes(current);
}
