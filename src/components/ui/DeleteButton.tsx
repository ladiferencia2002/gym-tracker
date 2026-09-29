"use client";

import { useTransition } from "react";

export function DeleteButton({ action, label }: { action: () => Promise<void>; label: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={() => startTransition(async () => { await action(); })}>
      <button
        type="submit"
        disabled={isPending}
        aria-label={label}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
      >
        ×
      </button>
    </form>
  );
}
