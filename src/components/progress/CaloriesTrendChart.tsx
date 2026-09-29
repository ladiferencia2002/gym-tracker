"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { addDays, formatDateHuman } from "@/lib/dates";
import type { ExerciseRow } from "@/lib/supabase/types";

const SERIES_COLOR = "#d95926"; // categorical slot 2 (orange), brand-consistent primary metric

export function CaloriesTrendChart({
  exercises,
  startDate,
  endDate,
}: {
  exercises: ExerciseRow[];
  startDate: string;
  endDate: string;
}) {
  const byDate = new Map<string, number>();
  for (const e of exercises) {
    byDate.set(e.performed_on, (byDate.get(e.performed_on) ?? 0) + e.calories);
  }

  const data: { date: string; label: string; calories: number }[] = [];
  for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
    data.push({ date: d, label: formatDateHuman(d), calories: byDate.get(d) ?? 0 });
  }

  const tickEvery = Math.max(1, Math.floor(data.length / 6));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="caloriesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.25} />
              <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2c2c2a" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="label"
            interval={tickEvery - 1}
            tick={{ fill: "#898781", fontSize: 11 }}
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
          <Tooltip content={<ChartTooltip unit="kcal" />} cursor={{ stroke: "#383835" }} />
          <Area
            type="monotone"
            dataKey="calories"
            stroke={SERIES_COLOR}
            strokeWidth={2}
            fill="url(#caloriesFill)"
            dot={false}
            activeDot={{ r: 4, fill: SERIES_COLOR, stroke: "#0f172a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
