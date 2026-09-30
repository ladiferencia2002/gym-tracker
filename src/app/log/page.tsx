"use client";

import { useAppData } from "@/lib/useAppData";
import { addExercise } from "@/lib/mutations";
import { todayLocal } from "@/lib/dates";
import { LogExerciseForm } from "@/components/exercises/LogExerciseForm";

export default function LogPage() {
  const { data, setData, hydrated } = useAppData();
  if (!hydrated) return null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Registrar entrenamiento</h1>
        <p className="text-sm text-slate-400">Cada sesión cuenta para tu racha.</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <LogExerciseForm
          bodyWeightKg={data.profile.bodyWeightKg}
          defaultDate={todayLocal()}
          onAdd={(input) => addExercise(setData, input)}
        />
      </div>
    </div>
  );
}
