"use client";

import { useMemo, useState } from "react";
import { CaloriesTrendChart } from "./CaloriesTrendChart";
import { TypeBreakdownChart } from "./TypeBreakdownChart";
import { MetricProgressChart } from "./MetricProgressChart";
import { EXERCISE_TYPES } from "@/lib/exerciseTypes";
import { addDays, todayLocal } from "@/lib/dates";
import type { ExerciseEntry } from "@/lib/types";

const RANGE_OPTIONS = [
  { days: 30, label: "30 días" },
  { days: 90, label: "90 días" },
];

export function ProgressView({ exercises }: { exercises: ExerciseEntry[] }) {
  const [rangeDays, setRangeDays] = useState(30);
  const today = todayLocal();
  const startDate = addDays(today, -(rangeDays - 1));

  const inRange = useMemo(
    () => exercises.filter((e) => e.performedOn >= startDate && e.performedOn <= today),
    [exercises, startDate, today]
  );

  const typesLogged = useMemo(() => {
    const ids = new Set(inRange.map((e) => e.type));
    return EXERCISE_TYPES.filter((t) => ids.has(t.id));
  }, [inRange]);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const effectiveType = selectedType && typesLogged.some((t) => t.id === selectedType) ? selectedType : typesLogged[0]?.id ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.days}
            type="button"
            onClick={() => setRangeDays(opt.days)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              rangeDays === opt.days ? "bg-orange-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-1 text-sm font-semibold text-white">Calorías por día</h2>
        <p className="mb-3 text-xs text-slate-500">Últimos {rangeDays} días</p>
        <CaloriesTrendChart exercises={inRange} startDate={startDate} endDate={today} />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-1 text-sm font-semibold text-white">Calorías por tipo de ejercicio</h2>
        <p className="mb-3 text-xs text-slate-500">Top 8 · últimos {rangeDays} días</p>
        <TypeBreakdownChart exercises={inRange} />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-white">Progresión por ejercicio</h2>
          {typesLogged.length > 0 && (
            <select
              value={effectiveType ?? ""}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-200 outline-none focus:border-orange-500"
            >
              {typesLogged.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.emoji} {t.label}
                </option>
              ))}
            </select>
          )}
        </div>
        {effectiveType ? (
          <MetricProgressChart exercises={inRange} typeId={effectiveType} />
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            Registra un entrenamiento para ver tu progresión aquí.
          </p>
        )}
      </section>
    </div>
  );
}
