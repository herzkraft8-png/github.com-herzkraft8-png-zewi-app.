"use server";

import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { getUser } from "@/lib/supabase/server";
import { decrypt } from "@/lib/crypto";
import { AgentError, PLATFORMS, runSocialAgent } from "@/lib/agents/social-media";

export type AgentState = { error?: string };

const inputSchema = z.object({
  goal: z.string().trim().min(3, "Bitte ein Ziel angeben.").max(500),
  topic: z.string().trim().max(500),
  platforms: z.array(z.enum(PLATFORMS)).min(1, "Bitte mindestens eine Plattform wählen."),
  postsPerWeek: z.coerce.number().int().min(1).max(14),
});

export async function runSocialAgentAction(_prev: AgentState, formData: FormData): Promise<AgentState> {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Bitte erneut einloggen." };

  const parsed = inputSchema.safeParse({
    goal: formData.get("goal"),
    topic: formData.get("topic") ?? "",
    platforms: formData.getAll("platforms"),
    postsPerWeek: formData.get("postsPerWeek"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, offer, audience, tone, extra_notes, encrypted_api_key")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.encrypted_api_key) {
    return { error: "Bitte zuerst im Profil Deinen Anthropic-API-Schlüssel hinterlegen." };
  }

  let result;
  try {
    result = await runSocialAgent(decrypt(profile.encrypted_api_key), profile, parsed.data);
  } catch (err) {
    if (err instanceof AgentError) return { error: err.message };
    console.error(err);
    return { error: "Unerwarteter Fehler. Bitte später erneut versuchen." };
  }

  const { data: saved, error } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      agent: "social-media",
      input: parsed.data,
      output: result.plan,
      model: result.model,
      input_tokens: result.inputTokens,
      output_tokens: result.outputTokens,
    })
    .select("id")
    .single();

  if (error || !saved) return { error: "Ergebnis erstellt, aber Speichern fehlgeschlagen." };

  redirect(`/dashboard/verlauf/${saved.id}`);
}

export async function deleteGeneration(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await getUser();
  if (!user || !id) return;
  await supabase.from("generations").delete().eq("id", id).eq("user_id", user.id);
  redirect("/dashboard");
}
