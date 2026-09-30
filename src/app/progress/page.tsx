"use client";

import { useAppData } from "@/lib/useAppData";
import { ProgressView } from "@/components/progress/ProgressView";

export default function ProgressPage() {
  const { data, hydrated } = useAppData();
  if (!hydrated) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tu progreso</h1>
        <p className="text-sm text-slate-400">Repeticiones, peso, distancia y tiempo a lo largo del tiempo.</p>
      </div>
      <ProgressView exercises={data.exercises} />
    </div>
  );
}
