"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { exerciseTypeMeta } from "@/lib/exerciseTypes";
import { formatDateHuman } from "@/lib/dates";
import type { ExerciseEntry } from "@/lib/types";

function metricFor(e: ExerciseEntry, meta: ReturnType<typeof exerciseTypeMeta>): number | null {
  if (meta.tracksSets) return e.weightKg;
  if (meta.tracksDistance) return e.distanceKm;
  return e.durationMinutes;
}

function metricLabel(meta: ReturnType<typeof exerciseTypeMeta>): { label: string; unit: string } {
  if (meta.tracksSets) return { label: "Peso levantado", unit: "kg" };
  if (meta.tracksDistance) return { label: "Distancia", unit: "km" };
  return { label: "Duración", unit: "min" };
}

export function MetricProgressChart({ exercises, typeId }: { exercises: ExerciseEntry[]; typeId: string }) {
  const meta = exerciseTypeMeta(typeId);
  const { label, unit } = metricLabel(meta);

  const data = exercises
    .filter((e) => e.type === typeId)
    .map((e) => ({ date: formatDateHuman(e.performedOn), value: metricFor(e, meta) }))
    .filter((d): d is { date: string; value: number } => d.value !== null);

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        Sin sesiones de {meta.label.toLowerCase()} en este período.
      </p>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#2c2c2a" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#898781", fontSize: 11 }}
            axisLine={{ stroke: "#383835" }}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#898781", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: "#383835" }} />
          <Line
            type="monotone"
            dataKey="value"
            name={label}
            stroke={meta.chartColor}
            strokeWidth={2}
            dot={{ r: 4, fill: meta.chartColor, stroke: "#0f172a", strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
