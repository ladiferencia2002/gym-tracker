"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error: string | null; info: string | null };

const INITIAL_STATE: AuthFormState = { error: null, info: null };

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ...INITIAL_STATE, error: "Completa correo y contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ...INITIAL_STATE, error: "Correo o contraseña incorrectos." };

  redirect("/dashboard");
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || !password) return { ...INITIAL_STATE, error: "Completa correo y contraseña." };
  if (password.length < 6) {
    return { ...INITIAL_STATE, error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName || undefined } },
  });
  if (error) return { ...INITIAL_STATE, error: error.message };

  if (!data.session) {
    return { ...INITIAL_STATE, info: "Te enviamos un correo de confirmación. Revisa tu bandeja de entrada." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
