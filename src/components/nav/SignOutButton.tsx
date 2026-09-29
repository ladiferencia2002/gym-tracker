"use client";

import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        Salir
      </button>
    </form>
  );
}
