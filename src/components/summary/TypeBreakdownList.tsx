import { exerciseTypeMeta } from "@/lib/exerciseTypes";
import type { TypeTotal } from "@/lib/monthlySummary";

export function TypeBreakdownList({ items }: { items: TypeTotal[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Sin entrenamientos este mes.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const meta = exerciseTypeMeta(item.type);
        return (
          <li key={item.type}>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="flex items-center gap-1.5 text-slate-200">
                <span>{meta.emoji}</span> {meta.label}
                <span className="text-xs text-slate-500">
                  ({item.sessions} {item.sessions === 1 ? "sesión" : "sesiones"})
                </span>
              </span>
              <span className="shrink-0 font-medium text-slate-100">
                {item.calories.toLocaleString("es")} kcal
                <span className="ml-1.5 text-xs font-normal text-slate-500">{item.percent.toFixed(0)}%</span>
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, item.percent)}%`, backgroundColor: meta.chartColor }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
