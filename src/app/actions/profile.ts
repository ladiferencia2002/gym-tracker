"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado.");

  const displayName = String(formData.get("displayName") ?? "").trim();
  const bodyWeightRaw = Number(formData.get("bodyWeightKg"));
  const bodyWeightKg = Number.isFinite(bodyWeightRaw) && bodyWeightRaw > 0 ? bodyWeightRaw : 70;

  await supabase
    .from("profiles")
    .update({ display_name: displayName || null, body_weight_kg: bodyWeightKg })
    .eq("id", user.id);

  revalidatePath("/settings");
  revalidatePath("/log");
}
