"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthFormState } from "@/app/actions/auth";

const INITIAL_STATE: AuthFormState = { error: null, info: null };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUp, INITIAL_STATE);

  if (state.info) {
    return (
      <div className="space-y-3 rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-center">
        <p className="text-2xl">📬</p>
        <p className="text-slate-100">{state.info}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="displayName" className="text-sm font-medium text-slate-300">
          Nombre
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          placeholder="Opcional"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-300">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-300">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-orange-500 py-2.5 font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
      >
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-slate-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-orange-400 hover:underline">
          Entra
        </Link>
      </p>
    </form>
  );
}
