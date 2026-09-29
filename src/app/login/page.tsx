import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
          <span>🔥</span> FitStreak
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <h1 className="mb-6 text-center text-xl font-semibold text-white">Bienvenido de vuelta</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
