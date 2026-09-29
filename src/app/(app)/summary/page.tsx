import { createClient } from "@/lib/supabase/server";
import { getExercisesInRange } from "@/lib/data/exercises";
import { currentMonthId, firstDayOfMonth, isValidMonthId, lastDayOfMonth, shiftMonthId } from "@/lib/dates";
import { computeMonthlySummary } from "@/lib/monthlySummary";
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

export default async function SummaryPage(props: PageProps<"/summary">) {
  const searchParams = await props.searchParams;
  const rawMonth = typeof searchParams.month === "string" ? searchParams.month : undefined;
  const monthId = rawMonth && isValidMonthId(rawMonth) ? rawMonth : currentMonthId();
  const previousMonthId = shiftMonthId(monthId, -1);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [monthExercises, previousMonthExercises] = await Promise.all([
    getExercisesInRange(supabase, user.id, firstDayOfMonth(monthId), lastDayOfMonth(monthId)),
    getExercisesInRange(supabase, user.id, firstDayOfMonth(previousMonthId), lastDayOfMonth(previousMonthId)),
  ]);

  const summary = computeMonthlySummary(monthExercises, previousMonthExercises);

  const stats = [
    { label: "Sesiones", value: summary.totalSessions },
    { label: "Calorías", value: summary.totalCalories.toLocaleString("es") },
    { label: "Días activos", value: summary.activeDays },
    { label: "Minutos totales", value: summary.totalMinutes.toLocaleString("es") },
  ];

  return (
    <div className="space-y-6">
      <MonthNav monthId={monthId} />

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
    </div>
  );
}
