import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
          <span>🔥</span> FitStreak
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <h1 className="mb-2 text-center text-xl font-semibold text-white">Empieza tu racha</h1>
          <p className="mb-6 text-center text-sm text-slate-400">
            Registra entrenamientos, mira tu progreso y no rompas la cadena.
          </p>
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
