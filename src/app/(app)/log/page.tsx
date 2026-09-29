import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { todayLocal } from "@/lib/dates";
import { LogExerciseForm } from "@/components/exercises/LogExerciseForm";

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id) : null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Registrar entrenamiento</h1>
        <p className="text-sm text-slate-400">Cada sesión cuenta para tu racha.</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <LogExerciseForm bodyWeightKg={profile?.body_weight_kg ?? 70} defaultDate={todayLocal()} />
      </div>
    </div>
  );
}
