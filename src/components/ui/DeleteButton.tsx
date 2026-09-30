"use client";

export function DeleteButton({ onDelete, label }: { onDelete: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onDelete}
      aria-label={label}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
    >
      ×
    </button>
  );
}
