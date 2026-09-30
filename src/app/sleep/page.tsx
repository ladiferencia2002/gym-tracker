"use client";

import { useAppData } from "@/lib/useAppData";
import { addSleep, deleteSleep } from "@/lib/mutations";
import { todayLocal } from "@/lib/dates";
import { useState } from "react";

const MOODS = [
  { value: "terrible", emoji: "😫", label: "Terrible" },
  { value: "mal", emoji: "😔", label: "Mal" },
  { value: "normal", emoji: "😐", label: "Normal" },
  { value: "bien", emoji: "😊", label: "Bien" },
  { value: "excelente", emoji: "🤩", label: "Excelente" },
] as const;

export default function SleepPage() {
  const { data, hydrated, setData } = useAppData();
  const [date, setDate] = useState(todayLocal());
  const [duration, setDuration] = useState(8);
  const [mood, setMood] = useState<"normal" | "mal" | "bien" | "terrible" | "excelente">("normal");
  const [notes, setNotes] = useState("");

  if (!hydrated) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (duration <= 0) return;
    addSleep(setData, {
      date,
      durationHours: duration,
      mood,
      notes: notes || null,
    });
    setDate(todayLocal());
    setDuration(8);
    setMood("normal");
    setNotes("");
  }

  const sleepByDate = new Map<string, typeof data.sleep[0]>();
  for (const entry of data.sleep) {
    if (!sleepByDate.has(entry.date) || new Date(entry.createdAt) > new Date(sleepByDate.get(entry.date)!.createdAt)) {
      sleepByDate.set(entry.date, entry);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Registrar sueño</h1>
        <p className="text-sm text-slate-400">Cuánto dormiste y cómo te levantaste.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium text-slate-300">
            Fecha (noche anterior)
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="text-sm font-medium text-slate-300">
            Horas de sueño
          </label>
          <input
            id="duration"
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
          />
          <p className="text-xs text-slate-500">Recomendado: 7-9 horas</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">¿Cómo te levantaste?</label>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value as typeof mood)}
                className={`rounded-xl py-2 text-center transition-all ${
                  mood === m.value
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="text-lg">{m.emoji}</div>
                <div className="text-xs">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-slate-300">
            Notas (opcional)
          </label>
          <input
            id="notes"
            type="text"
            placeholder="Ej: Me costó dormir, ruido de vecinos..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-400"
        >
          Guardar sueño
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Registro reciente</h2>
        {Array.from(sleepByDate.values())
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)
          .map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{entry.date}</div>
                <div className="text-xs text-slate-400">
                  {entry.durationHours}h · {MOODS.find((m) => m.value === entry.mood)?.emoji} {MOODS.find((m) => m.value === entry.mood)?.label}
                  {entry.notes && ` · ${entry.notes}`}
                </div>
              </div>
              <button
                onClick={() => deleteSleep(setData, entry.id)}
                className="text-slate-500 hover:text-red-400"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        {sleepByDate.size === 0 && <p className="text-sm text-slate-500">Aún no hay registros de sueño.</p>}
      </section>
    </div>
  );
}
