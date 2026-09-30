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

export type Profile = {
  displayName: string;
  bodyWeightKg: number;
};

export type AppData = {
  profile: Profile;
  exercises: ExerciseEntry[];
};
