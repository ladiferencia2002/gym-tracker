"use client";

import { useState } from "react";
import { useAppData } from "@/lib/useAppData";
import { currentMonthId, firstDayOfMonth, lastDayOfMonth, shiftMonthId } from "@/lib/dates";
import { computeMonthlySummary } from "@/lib/monthlySummary";
import { computeSleepStats } from "@/lib/sleepStats";
import { generateMonthlyPDF } from "@/lib/pdfExport";
import { MonthNav } from "@/components/summary/MonthNav";
import { TypeBreakdownList } from "@/components/summary/TypeBreakdownList";

function trendMessage(percent: number | null): string {
  if (percent === null) return "Sin datos del mes anterior para comparar.";
  const rounded = Math.round(Math.abs(percent));
  if (rounded < 5) return "Ritmo muy similar al mes pasado.";
  return percent > 0
    ? `+${rounded}% más activo que el mes pasado 📈`
    : `${rounded}% menos que el mes pasado — vamos por más 💪`;
}

export default function SummaryPage() {
  const { data, hydrated } = useAppData();
  const [monthId, setMonthId] = useState(() => currentMonthId());

  if (!hydrated) return null;

  const previousMonthId = shiftMonthId(monthId, -1);
  const monthStart = firstDayOfMonth(monthId);
  const monthEnd = lastDayOfMonth(monthId);

  const monthExercises = data.exercises.filter(
    (e) => e.performedOn >= monthStart && e.performedOn <= monthEnd
  );
  const previousMonthExercises = data.exercises.filter(
    (e) => e.performedOn >= firstDayOfMonth(previousMonthId) && e.performedOn <= lastDayOfMonth(previousMonthId)
  );
  const monthSleep = data.sleep.filter(
    (s) => s.date >= monthStart && s.date <= monthEnd
  );

  const summary = computeMonthlySummary(monthExercises, previousMonthExercises);
  const sleepStats = computeSleepStats(monthSleep);

  const MOOD_EMOJIS = { terrible: "😫", mal: "😔", normal: "😐", bien: "😊", excelente: "🤩" };

  const stats = [
    { label: "Sesiones", value: summary.totalSessions },
    { label: "Calorías", value: summary.totalCalories.toLocaleString("es") },
    { label: "Días activos", value: summary.activeDays },
    { label: "Minutos totales", value: summary.totalMinutes.toLocaleString("es") },
  ];

  function handleDownloadPDF() {
    generateMonthlyPDF(data, monthId);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <MonthNav
            monthId={monthId}
            onPrev={() => setMonthId(shiftMonthId(monthId, -1))}
            onNext={() => setMonthId(shiftMonthId(monthId, 1))}
            onToday={() => setMonthId(currentMonthId())}
          />
        </div>
        <button
          onClick={handleDownloadPDF}
          className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-400"
          title="Descargar resumen en PDF"
        >
          📥 PDF
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center text-sm text-slate-300">
        {trendMessage(summary.caloriesTrendPercent)}
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold text-white">Por tipo de ejercicio</h2>
        <TypeBreakdownList items={summary.byType} />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold text-white">Resumen de sueño</h2>
        {sleepStats.totalNights > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-800/50 p-3">
                <p className="text-2xl font-bold text-white">{sleepStats.totalNights}</p>
                <p className="text-xs text-slate-400">Noches registradas</p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-3">
                <p className="text-2xl font-bold text-white">{sleepStats.avgDurationHours}h</p>
                <p className="text-xs text-slate-400">Promedio de sueño</p>
              </div>
            </div>
            {sleepStats.bestMood && (
              <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                <p className="text-lg">{MOOD_EMOJIS[sleepStats.bestMood]}</p>
                <p className="text-xs text-slate-400">Cómo te levantaste más frecuente</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aún no hay registros de sueño en este mes.</p>
        )}
      </section>
    </div>
  );
}
