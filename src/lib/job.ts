import { supabaseAdmin } from "./supabase";
import { agentById } from "./agenten";
import { produzieren, type Profil } from "./ki";

/** Die letzten Rückmeldungen dieses Kundenprofils – zuerst die zum selben Agenten. */
export async function lernnotizenFuer(markeId: string | null, agent: string) {
  if (!markeId) return [];
  const { data } = await supabaseAdmin().from("lernnotizen").select("agent, art, text").eq("marke_id", markeId).order("created_at", { ascending: false }).limit(40);
  const zeile = (n: { agent: string | null; art: string; text: string }) =>
    `${n.art === "gut" ? "Gefiel" : n.art === "schlecht" ? "Gefiel NICHT" : n.art === "aenderung" ? "Wollte geändert haben" : "Hinweis"}: ${n.text}`;
  const passend = (data ?? []).filter((n) => n.agent === agent);
  const rest = (data ?? []).filter((n) => n.agent !== agent && n.art !== "aenderung");
  return [...passend.slice(0, 8), ...rest.slice(0, 4)].map(zeile);
}

/** Läuft im Hintergrund (after()): erstellt, prüft und speichert das Ergebnis. */
export async function jobAusfuehren(jobId: string, aenderung?: { vorher: string; wunsch: string }) {
  const admin = supabaseAdmin();
  const { data: job } = await admin.from("jobs").select("*").eq("id", jobId).single();
  if (!job) return;
  const agent = agentById(job.agent);
  if (!agent) return;
  const { data: profil } = job.marke_id
    ? await admin.from("marken").select("*").eq("id", job.marke_id).maybeSingle()
    : { data: null };
  const notizen = await lernnotizenFuer(job.marke_id, job.agent);
  try {
    const { ergebnis, qa, runden } = await produzieren(agent, (profil ?? {}) as Profil, job.briefing ?? {}, aenderung, notizen);
    await admin.from("jobs").update({
      ergebnis,
      qa_score: qa.score,
      qa_notiz: qa.maengel.join("\n"),
      runden: (job.runden ?? 0) + runden,
      status: "zur_freigabe",
      updated_at: new Date().toISOString(),
    }).eq("id", jobId);
  } catch (e) {
    console.error("Job fehlgeschlagen", jobId, e);
    await admin.from("jobs").update({
      status: "fehler",
      qa_notiz: "Die KI war nicht erreichbar. Bitte später erneut versuchen.",
      ergebnis: aenderung?.vorher ?? job.ergebnis ?? "",
      updated_at: new Date().toISOString(),
    }).eq("id", jobId);
  }
}
