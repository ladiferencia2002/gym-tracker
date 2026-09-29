import { exerciseTypeMeta } from "./exerciseTypes";

/**
 * Estimates calories burned using the standard MET formula:
 * kcal/min = (MET * 3.5 * bodyWeightKg) / 200
 *
 * This is an approximation (real burn depends on intensity, fitness level,
 * etc.) - it's meant as a sensible default the user can always override.
 */
export function estimateCalories(
  typeId: string,
  durationMinutes: number,
  bodyWeightKg: number
): number {
  const { met } = exerciseTypeMeta(typeId);
  const kcalPerMinute = (met * 3.5 * bodyWeightKg) / 200;
  return Math.max(0, Math.round(kcalPerMinute * durationMinutes));
}
