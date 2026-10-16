"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { getUser } from "@/lib/supabase/server";
import { encrypt } from "@/lib/crypto";

export type FormState = { error?: string; message?: string };

const profileSchema = z.object({
  business_name: z.string().trim().max(200),
  offer: z.string().trim().max(2000),
  audience: z.string().trim().max(2000),
  tone: z.string().trim().max(500),
  extra_notes: z.string().trim().max(3000),
});

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Bitte erneut einloggen." };

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Ein Feld ist zu lang. Bitte kürzen." };

  const { error } = await supabase
    .from("profiles")
    .upsert({ user_id: user.id, ...parsed.data, updated_at: new Date().toISOString() });
  if (error) return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };

  revalidatePath("/dashboard", "layout");
  return { message: "Profil gespeichert." };
}

export async function saveApiKey(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Bitte erneut einloggen." };

  const key = String(formData.get("api_key") ?? "").trim();
  if (!key.startsWith("sk-ant-") || key.length < 30) {
    return { error: "Das sieht nicht nach einem Anthropic-Schlüssel aus (beginnt mit „sk-ant-“)." };
  }

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    encrypted_api_key: encrypt(key),
    api_key_last4: key.slice(-4),
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };

  revalidatePath("/dashboard", "layout");
  return { message: "Schlüssel verschlüsselt gespeichert." };
}

export async function deleteApiKey() {
  const { supabase, user } = await getUser();
  if (!user) return;
  await supabase
    .from("profiles")
    .update({ encrypted_api_key: null, api_key_last4: null })
    .eq("user_id", user.id);
  revalidatePath("/dashboard", "layout");
}
