"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthFormState } from "@/app/actions/auth";

const INITIAL_STATE: AuthFormState = { error: null, info: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4">
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
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 outline-none focus:border-orange-500"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-orange-500 py-2.5 font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-50"
      >
        {isPending ? "Entrando…" : "Entrar"}
      </button>

      <p className="text-center text-sm text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="font-medium text-orange-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
