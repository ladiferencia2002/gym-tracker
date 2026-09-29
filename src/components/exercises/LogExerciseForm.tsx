"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createExercise } from "@/app/actions/exercises";
import { EXERCISE_TYPES, exerciseTypeMeta, type ExerciseTypeId } from "@/lib/exerciseTypes";
import { estimateCalories } from "@/lib/calories";

export function LogExerciseForm({
  bodyWeightKg,
  defaultDate,
}: {
  bodyWeightKg: number;
  defaultDate: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<ExerciseTypeId>("running");
  const [duration, setDuration] = useState("30");
  const [caloriesOverridden, setCaloriesOverridden] = useState(false);
  const [calories, setCalories] = useState(() => estimateCalories("running", 30, bodyWeightKg));
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const meta = useMemo(() => exerciseTypeMeta(type), [type]);

  function handleTypeChange(next: ExerciseTypeId) {
    setType(next);
    if (!caloriesOverridden) {
      const minutes = Number(duration) || 0;
      setCalories(estimateCalories(next, minutes, bodyWeightKg));
    }
  }

  function handleDurationChange(value: string) {
    setDuration(value);
    if (!caloriesOverridden) {
      const minutes = Number(value) || 0;
      setCalories(estimateCalories(type, minutes, bodyWeightKg));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createExercise(formData);
      formRef.current?.reset();
      setCaloriesOverridden(false);
      setJustSaved(true);
      router.refresh();
      window.setTimeout(() => setJustSaved(false), 2500);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="calories" value={calories} />

      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">¿Qué entrenaste?</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {EXERCISE_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTypeChange(t.id)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-xs transition-colors ${
                type === t.id
                  ? "border-orange-500 bg-orange-500/10 text-orange-300"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
              }`}
            >
              <span className="text-xl">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="durationMinutes" className="text-sm font-medium text-slate-300">
            Duración (min)
          </label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min="1"
            step="1"
            required
            value={duration}
            onChange={(e) => handleDurationChange(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium text-slate-300">
            Fecha
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={defaultDate}
            max={defaultDate}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {meta.tracksDistance && (
        <div className="space-y-1">
          <label htmlFor="distanceKm" className="text-sm font-medium text-slate-300">
            Distancia (km)
          </label>
          <input
            id="distanceKm"
            name="distanceKm"
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
          />
        </div>
      )}

      {meta.tracksSets && (
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="weightKg" className="text-sm font-medium text-slate-300">
              Peso (kg)
            </label>
            <input
              id="weightKg"
              name="weightKg"
              type="number"
              min="0"
              step="0.5"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="sets" className="text-sm font-medium text-slate-300">
              Series
            </label>
            <input
              id="sets"
              name="sets"
              type="number"
              min="0"
              step="1"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="reps" className="text-sm font-medium text-slate-300">
              Reps
            </label>
            <input
              id="reps"
              name="reps"
              type="number"
              min="0"
              step="1"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="caloriesDisplay" className="text-sm font-medium text-slate-300">
          Calorías estimadas
        </label>
        <input
          id="caloriesDisplay"
          type="number"
          min="0"
          step="1"
          value={calories}
          onChange={(e) => {
            setCaloriesOverridden(true);
            setCalories(Number(e.target.value) || 0);
          }}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
        <p className="text-xs text-slate-500">Se calcula solo, pero puedes ajustarla.</p>
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="text-sm font-medium text-slate-300">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Opcional"
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
      >
        {isPending ? "Guardando…" : justSaved ? "¡Guardado! 🎉" : "Guardar entrenamiento"}
      </button>
    </form>
  );
}
