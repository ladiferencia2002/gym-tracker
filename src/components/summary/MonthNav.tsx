import Link from "next/link";
import { currentMonthId, monthLabel, shiftMonthId } from "@/lib/dates";

export function MonthNav({ monthId }: { monthId: string }) {
  const prev = shiftMonthId(monthId, -1);
  const next = shiftMonthId(monthId, 1);
  const isCurrentMonth = monthId === currentMonthId();

  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={`/summary?month=${prev}`}
        aria-label="Mes anterior"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition-colors hover:bg-slate-800"
      >
        ←
      </Link>
      <div className="text-center">
        <h1 className="text-lg font-semibold text-white">{monthLabel(monthId)}</h1>
        {!isCurrentMonth && (
          <Link href="/summary" className="text-xs text-slate-500 hover:underline">
            Volver al mes actual
          </Link>
        )}
      </div>
      <Link
        href={`/summary?month=${next}`}
        aria-label="Mes siguiente"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition-colors hover:bg-slate-800"
      >
        →
      </Link>
    </div>
  );
}
