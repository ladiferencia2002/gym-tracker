export function QuickStats({
  sessionsThisWeek,
  caloriesThisMonth,
  activeDaysThisMonth,
}: {
  sessionsThisWeek: number;
  caloriesThisMonth: number;
  activeDaysThisMonth: number;
}) {
  const stats = [
    { label: "Esta semana", value: sessionsThisWeek, suffix: sessionsThisWeek === 1 ? "sesión" : "sesiones" },
    { label: "Este mes", value: caloriesThisMonth.toLocaleString("es"), suffix: "kcal" },
    { label: "Días activos (mes)", value: activeDaysThisMonth, suffix: "días" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center">
          <p className="text-xl font-bold text-white sm:text-2xl">{s.value}</p>
          <p className="text-[11px] text-slate-500">{s.suffix}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
