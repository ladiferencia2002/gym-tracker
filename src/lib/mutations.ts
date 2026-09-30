import type { SetAppData } from "./useAppData";
import type { ExerciseTypeId } from "./exerciseTypes";

function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export type NewExerciseInput = {
  type: ExerciseTypeId;
  performedOn: string;
  durationMinutes: number;
  distanceKm: number | null;
  weightKg: number | null;
  reps: number | null;
  sets: number | null;
  calories: number;
  notes: string | null;
};

export function addExercise(setData: SetAppData, input: NewExerciseInput): void {
  setData((prev) => ({
    ...prev,
    exercises: [...prev.exercises, { id: makeId(), createdAt: new Date().toISOString(), ...input }],
  }));
}

export function deleteExercise(setData: SetAppData, id: string): void {
  setData((prev) => ({ ...prev, exercises: prev.exercises.filter((e) => e.id !== id) }));
}

export function updateProfile(setData: SetAppData, displayName: string, bodyWeightKg: number): void {
  setData((prev) => ({ ...prev, profile: { displayName, bodyWeightKg } }));
}

export type NewSleepInput = {
  date: string;
  durationHours: number;
  mood: "terrible" | "mal" | "normal" | "bien" | "excelente";
  notes: string | null;
};

export function addSleep(setData: SetAppData, input: NewSleepInput): void {
  setData((prev) => ({
    ...prev,
    sleep: [...prev.sleep, { id: makeId(), createdAt: new Date().toISOString(), ...input }],
  }));
}

export function deleteSleep(setData: SetAppData, id: string): void {
  setData((prev) => ({ ...prev, sleep: prev.sleep.filter((s) => s.id !== id) }));
}
