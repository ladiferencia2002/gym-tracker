"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { estimateCalories } from "@/lib/calories";
import { isExerciseTypeId } from "@/lib/exerciseTypes";
import { isValidDate } from "@/lib/dates";

function numberOrNull(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function createExercise(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado.");

  const type = String(formData.get("type") ?? "");
  const date = String(formData.get("date") ?? "");
  const durationMinutes = numberOrNull(formData.get("durationMinutes"));
  const notes = String(formData.get("notes") ?? "").trim();
  const manualCalories = numberOrNull(formData.get("calories"));
  const distanceKm = numberOrNull(formData.get("distanceKm"));
  const weightKg = numberOrNull(formData.get("weightKg"));
  const reps = numberOrNull(formData.get("reps"));
  const sets = numberOrNull(formData.get("sets"));

  if (!isExerciseTypeId(type) || !isValidDate(date) || !durationMinutes || durationMinutes <= 0) {
    return;
  }

  const profile = await getProfile(supabase, user.id);
  const bodyWeight = profile?.body_weight_kg ?? 70;
  const calories = manualCalories ?? estimateCalories(type, durationMinutes, bodyWeight);

  await supabase.from("exercises").insert({
    user_id: user.id,
    type,
    performed_on: date,
    duration_minutes: durationMinutes,
    distance_km: distanceKm,
    weight_kg: weightKg,
    reps,
    sets,
    calories,
    notes: notes || null,
    source: "manual",
    external_id: null,
  });

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/summary");
}

export async function deleteExercise(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado.");

  await supabase.from("exercises").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/summary");
}
