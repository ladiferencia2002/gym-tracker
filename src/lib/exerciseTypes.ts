export type ExerciseCategory = "cardio" | "strength" | "flexibility" | "sports";

export type ExerciseTypeId =
  | "running"
  | "walking"
  | "cycling"
  | "swimming"
  | "hiking"
  | "rowing"
  | "weightlifting"
  | "crossfit"
  | "hiit"
  | "yoga"
  | "pilates"
  | "stretching"
  | "zumba"
  | "dance"
  | "boxing"
  | "other";

export type ExerciseTypeMeta = {
  id: ExerciseTypeId;
  label: string;
  emoji: string;
  category: ExerciseCategory;
  /** MET (metabolic equivalent) at typical intensity, used to estimate calories. */
  met: number;
  tracksDistance: boolean;
  tracksSets: boolean;
  /**
   * Fixed categorical slot (dark-mode, validated against #0f172a via
   * dataviz's validate_palette.js). Kept per-type so a type's color never
   * shifts when the set of logged types changes. 16 types share 8 safe
   * slots; reused pairs are cross-category so they rarely appear together,
   * and every chart also direct-labels the type, so color is never the only
   * identity channel.
   */
  chartColor: string;
};

export const EXERCISE_TYPES: ExerciseTypeMeta[] = [
  { id: "running", label: "Correr", emoji: "🏃", category: "cardio", met: 9.8, tracksDistance: true, tracksSets: false, chartColor: "#3987e5" },
  { id: "walking", label: "Caminar", emoji: "🚶", category: "cardio", met: 3.5, tracksDistance: true, tracksSets: false, chartColor: "#3987e5" },
  { id: "cycling", label: "Ciclismo", emoji: "🚴", category: "cardio", met: 7.5, tracksDistance: true, tracksSets: false, chartColor: "#c98500" },
  { id: "swimming", label: "Natación", emoji: "🏊", category: "cardio", met: 8.0, tracksDistance: true, tracksSets: false, chartColor: "#199e70" },
  { id: "hiking", label: "Senderismo", emoji: "🥾", category: "cardio", met: 6.0, tracksDistance: true, tracksSets: false, chartColor: "#199e70" },
  { id: "rowing", label: "Remo", emoji: "🚣", category: "cardio", met: 7.0, tracksDistance: true, tracksSets: false, chartColor: "#9085e9" },
  { id: "weightlifting", label: "Pesas", emoji: "🏋️", category: "strength", met: 5.0, tracksDistance: false, tracksSets: true, chartColor: "#d95926" },
  { id: "crossfit", label: "CrossFit", emoji: "💪", category: "strength", met: 8.0, tracksDistance: false, tracksSets: true, chartColor: "#d95926" },
  { id: "hiit", label: "HIIT", emoji: "🔥", category: "cardio", met: 8.5, tracksDistance: false, tracksSets: false, chartColor: "#9085e9" },
  { id: "yoga", label: "Yoga", emoji: "🧘", category: "flexibility", met: 3.0, tracksDistance: false, tracksSets: false, chartColor: "#008300" },
  { id: "pilates", label: "Pilates", emoji: "🤸", category: "flexibility", met: 3.5, tracksDistance: false, tracksSets: false, chartColor: "#c98500" },
  { id: "stretching", label: "Estiramiento", emoji: "🙆", category: "flexibility", met: 2.5, tracksDistance: false, tracksSets: false, chartColor: "#008300" },
  { id: "zumba", label: "Zumba", emoji: "💃", category: "sports", met: 6.5, tracksDistance: false, tracksSets: false, chartColor: "#d55181" },
  { id: "dance", label: "Baile", emoji: "🕺", category: "sports", met: 5.5, tracksDistance: false, tracksSets: false, chartColor: "#d55181" },
  { id: "boxing", label: "Boxeo", emoji: "🥊", category: "sports", met: 9.0, tracksDistance: false, tracksSets: false, chartColor: "#e66767" },
  { id: "other", label: "Otro", emoji: "⭐", category: "sports", met: 5.0, tracksDistance: false, tracksSets: false, chartColor: "#e66767" },
];

const BY_ID = new Map(EXERCISE_TYPES.map((t) => [t.id, t]));

export function exerciseTypeMeta(id: string): ExerciseTypeMeta {
  return BY_ID.get(id as ExerciseTypeId) ?? EXERCISE_TYPES[EXERCISE_TYPES.length - 1];
}

export function isExerciseTypeId(id: string): id is ExerciseTypeId {
  return BY_ID.has(id as ExerciseTypeId);
}

// Best-effort mapping from Strava's `type`/`sport_type` values to ours.
export const STRAVA_TYPE_MAP: Record<string, ExerciseTypeId> = {
  Run: "running",
  TrailRun: "running",
  Walk: "walking",
  Hike: "hiking",
  Ride: "cycling",
  VirtualRide: "cycling",
  MountainBikeRide: "cycling",
  Swim: "swimming",
  Rowing: "rowing",
  WeightTraining: "weightlifting",
  Crossfit: "crossfit",
  HighIntensityIntervalTraining: "hiit",
  Yoga: "yoga",
  Pilates: "pilates",
  Workout: "other",
};
