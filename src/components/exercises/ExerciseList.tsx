import { exerciseTypeMeta } from "@/lib/exerciseTypes";
import { formatDateHuman } from "@/lib/dates";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { ExerciseEntry } from "@/lib/types";

function summarizeExercise(e: ExerciseEntry): string {
  const parts = [`${e.durationMinutes} min`];
  if (e.distanceKm) parts.push(`${e.distanceKm} km`);
  if (e.sets && e.reps) parts.push(`${e.sets}x${e.reps}`);
  if (e.weightKg) parts.push(`${e.weightKg} kg`);
  return parts.join(" · ");
}

export function ExerciseList({
  exercises,
  onDelete,
}: {
  exercises: ExerciseEntry[];
  onDelete: (id: string) => void;
}) {
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
              <p className="truncate text-sm font-medium text-slate-100">{meta.label}</p>
              <p className="truncate text-xs text-slate-500">
                {formatDateHuman(e.performedOn)} · {summarizeExercise(e)}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-slate-400">{e.calories} kcal</span>
            <DeleteButton onDelete={() => onDelete(e.id)} label={`Eliminar ${meta.label}`} />
          </li>
        );
      })}
    </ul>
  );
}
