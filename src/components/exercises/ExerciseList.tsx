import { deleteExercise } from "@/app/actions/exercises";
import { exerciseTypeMeta } from "@/lib/exerciseTypes";
import { formatDateHuman } from "@/lib/dates";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { ExerciseRow } from "@/lib/supabase/types";

function summarizeExercise(e: ExerciseRow): string {
  const parts = [`${e.duration_minutes} min`];
  if (e.distance_km) parts.push(`${e.distance_km} km`);
  if (e.sets && e.reps) parts.push(`${e.sets}x${e.reps}`);
  if (e.weight_kg) parts.push(`${e.weight_kg} kg`);
  return parts.join(" · ");
}

export function ExerciseList({ exercises }: { exercises: ExerciseRow[] }) {
  if (exercises.length === 0) {
    return <p className="py-4 text-sm text-slate-500">Aún no registras entrenamientos.</p>;
  }

  return (
    <ul className="divide-y divide-slate-800">
      {exercises.map((e) => {
        const meta = exerciseTypeMeta(e.type);
        return (
          <li key={e.id} className="flex items-center gap-3 py-3">
            <span className="text-2xl">{meta.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-100">
                {meta.label}
                {e.source === "strava" && (
                  <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-400">
                    Strava
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-slate-500">
                {formatDateHuman(e.performed_on)} · {summarizeExercise(e)}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-slate-400">{e.calories} kcal</span>
            <DeleteButton action={deleteExercise.bind(null, e.id)} label={`Eliminar ${meta.label}`} />
          </li>
        );
      })}
    </ul>
  );
}
