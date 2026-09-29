"use client";

type TooltipPayloadItem = {
  value?: number | string;
  name?: string;
  color?: string;
  unit?: string;
};

export function ChartTooltip({
  active,
  label,
  payload,
  unit,
}: {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
  unit?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      {label && <p className="mb-1 text-xs text-slate-400">{label}</p>}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="font-semibold text-white">{item.value}</span>
          <span className="text-slate-500">{item.unit ?? unit}</span>
          {item.name && <span className="text-slate-500">· {item.name}</span>}
        </div>
      ))}
    </div>
  );
}
