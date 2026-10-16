import { cookies } from "next/headers";
import { supabaseAdmin, supabaseServer } from "./supabase";

export const MARKEN_COOKIE = "zewi_marke";

export type Marke = {
  id: string; user_id: string; name: string; firma: string; branche: string; ort: string; website: string;
  angebot: string; zielgruppe: string; ton: string; anrede: string; besonderheiten: string; tabus: string;
  plattformen: string; frequenz: string; created_at: string;
};

/** Alle Kundenprofile des Nutzers; legt das erste an, falls keines existiert. */
export async function markenListe(userId: string): Promise<Marke[]> {
  const sb = await supabaseServer();
  const { data } = await sb.from("marken").select("*").order("created_at", { ascending: true });
  if (data && data.length) return data as Marke[];
  const { data: neu } = await supabaseAdmin().from("marken").insert({ user_id: userId, name: "Mein Betrieb" }).select("*").single();
  return neu ? [neu as Marke] : [];
}

/** Aktives Kundenprofil (Cookie), sonst das erste. */
export async function aktiveMarke(userId: string): Promise<{ aktiv: Marke; alle: Marke[] }> {
  const alle = await markenListe(userId);
  const id = (await cookies()).get(MARKEN_COOKIE)?.value;
  const aktiv = alle.find((m) => m.id === id) ?? alle[0];
  return { aktiv, alle };
}

/** Wie vollständig ist der KI-Zwilling? (0–100) */
export function zwillingProzent(m: Partial<Marke>) {
  const felder: (keyof Marke)[] = ["firma", "branche", "ort", "angebot", "zielgruppe", "ton", "besonderheiten", "plattformen", "website", "tabus"];
  const gewicht: Partial<Record<keyof Marke, number>> = { firma: 15, branche: 10, ort: 10, angebot: 20, zielgruppe: 15, ton: 10, besonderheiten: 8, plattformen: 5, website: 4, tabus: 3 };
  let p = 0;
  for (const f of felder) if (String(m[f] ?? "").trim()) p += gewicht[f] ?? 0;
  return Math.min(100, p);
}
