import type { ExerciseTypeId } from "./exerciseTypes";

export type ExerciseEntry = {
  id: string;
  type: ExerciseTypeId;
  performedOn: string; // "YYYY-MM-DD"
  durationMinutes: number;
  distanceKm: number | null;
  weightKg: number | null;
  reps: number | null;
  sets: number | null;
  calories: number;
  notes: string | null;
  createdAt: string;
};

export type SleepEntry = {
  id: string;
  date: string; // "YYYY-MM-DD" (noche anterior)
  durationHours: number;
  mood: "terrible" | "mal" | "normal" | "bien" | "excelente";
  notes: string | null;
  createdAt: string;
};

export type Profile = {
  displayName: string;
  bodyWeightKg: number;
};

export type AppData = {
  profile: Profile;
  exercises: ExerciseEntry[];
  sleep: SleepEntry[];
};
