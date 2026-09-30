import type { AppData } from "./types";

const STORAGE_KEY = "fitstreak-data-v1";

export function emptyData(): AppData {
  return { profile: { displayName: "", bodyWeightKg: 70 }, exercises: [], sleep: [] };
}

export function loadData(): AppData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      profile: { ...emptyData().profile, ...parsed.profile },
      exercises: parsed.exercises ?? [],
      sleep: parsed.sleep ?? [],
    };
  } catch {
    return emptyData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode, quota exceeded): state still works for this session.
  }
}
