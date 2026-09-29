import { createClient } from "@/lib/supabase/server";
import { getExercisesSince } from "@/lib/data/exercises";
import { addDays, todayLocal } from "@/lib/dates";
import { ProgressView } from "@/components/progress/ProgressView";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = todayLocal();
  const exercises = await getExercisesSince(supabase, user.id, addDays(today, -90));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tu progreso</h1>
        <p className="text-sm text-slate-400">Repeticiones, peso, distancia y tiempo a lo largo del tiempo.</p>
      </div>
      <ProgressView exercises={exercises} />
    </div>
  );
}
