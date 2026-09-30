"use client";

import { useState } from "react";

export function ProfileForm({
  displayName: initialDisplayName,
  bodyWeightKg: initialWeight,
  onSave,
}: {
  displayName: string;
  bodyWeightKg: number;
  onSave: (displayName: string, bodyWeightKg: number) => void;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bodyWeightKg, setBodyWeightKg] = useState(initialWeight);
  const [justSaved, setJustSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave(displayName, bodyWeightKg);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="displayName" className="text-sm font-medium text-slate-300">
          Nombre
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="bodyWeightKg" className="text-sm font-medium text-slate-300">
          Peso corporal (kg)
        </label>
        <input
          id="bodyWeightKg"
          type="number"
          min="1"
          step="0.5"
          value={bodyWeightKg}
          onChange={(e) => setBodyWeightKg(parseFloat(e.target.value) || initialWeight)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
        <p className="text-xs text-slate-500">Se usa para estimar las calorías quemadas.</p>
      </div>
      <button
        type="submit"
        className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
      >
        {justSaved ? "Guardado ✓" : "Guardar cambios"}
      </button>
    </form>
  );
}
