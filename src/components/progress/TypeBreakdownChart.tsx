"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { exerciseTypeMeta } from "@/lib/exerciseTypes";
import type { ExerciseRow } from "@/lib/supabase/types";

function BreakdownTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value?: number; payload?: { type: string; meta: ReturnType<typeof exerciseTypeMeta> } }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;
  if (!row) return null;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2 text-sm">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.meta.chartColor }} />
        <span className="font-semibold text-white">{payload[0].value}</span>
        <span className="text-slate-500">kcal</span>
        <span className="text-slate-500">
          · {row.meta.emoji} {row.meta.label}
        </span>
      </div>
    </div>
  );
}

export function TypeBreakdownChart({ exercises }: { exercises: ExerciseRow[] }) {
  const totals = new Map<string, number>();
  for (const e of exercises) {
    totals.set(e.type, (totals.get(e.type) ?? 0) + e.calories);
  }

  const data = [...totals.entries()]
    .map(([type, calories]) => ({ type, calories, meta: exerciseTypeMeta(type) }))
    .sort((a, b) => b.calories - a.calories)
    .slice(0, 8);

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">Sin datos en este período.</p>;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#2c2c2a" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="type"
            tickFormatter={(type: string) => exerciseTypeMeta(type).emoji}
            tick={{ fontSize: 16 }}
            axisLine={{ stroke: "#383835" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#898781", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
            allowDecimals={false}
          />
          <Tooltip content={<BreakdownTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="calories" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((d) => (
              <Cell key={d.type} fill={d.meta.chartColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
        {data.map((d) => (
          <span key={d.type} className="text-[11px] text-slate-500">
            {d.meta.emoji} {d.meta.label}
          </span>
        ))}
      </div>
    </div>
  );
}
