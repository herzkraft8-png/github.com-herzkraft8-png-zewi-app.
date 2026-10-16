import Anthropic from "@anthropic-ai/sdk";
import type { Agent } from "./agenten";
import { boardWissen } from "./board";
import { FENSTER_REGELN, GESUNDHEIT_REGELN, istFenster, istGesundheit } from "./branchen";
import { CAPITAL_REGELN, IST_CAPITAL, PROFIL_FELDER } from "./produkt";

export type Profil = {
  firma?: string; branche?: string; ort?: string; website?: string; angebot?: string;
  zielgruppe?: string; ton?: string; anrede?: string; besonderheiten?: string; tabus?: string;
  plattformen?: string; frequenz?: string;
};

const MODELL = () => process.env.ZEWI_MODELL || "claude-sonnet-5-5";

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, baseURL: process.env.ANTHROPIC_BASE_URL || undefined });
}

async function frage(prompt: string, maxTokens: number, modell?: string) {
  const res = await client().messages.create({
    model: modell || MODELL(),
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return res.content.map((c) => (c.type === "text" ? c.text : "")).join("").trim();
}

export function profilText(p: Profil) {
  const z = (k: string, v?: string) => (v && v.trim() ? `- ${k}: ${v.trim()}` : "");
  const rec = p as Record<string, string | undefined>;
  const zeilen = PROFIL_FELDER.filter((f) => f.key !== "name").map((f) => z(f.label, rec[f.key]));
  if (!IST_CAPITAL) zeilen.push(z("Anrede der Kunden", p.anrede));
  return zeilen.filter(Boolean).join("\n") || "- (Profil noch leer – nutze Platzhalter in eckigen Klammern)";
}

const REGELN_AGENTUR = `REGELN:
- Deutsch für Österreich. Anrede der Leser wie im Markenprofil angegeben.
- Erfinde KEINE Fakten über den Betrieb (Preise, Jahre, Auszeichnungen, Kundenzahlen, Zitate, Studien). Fehlt etwas: Platzhalter in [eckigen Klammern].
- Keine Heil-, Gewinn- oder Erfolgsversprechen, keine unbelegten Superlative.
- Ergebnis sofort verwendbar. Keine Einleitung wie "Hier ist…", keine Erklärung, was du getan hast.`;

const REGELN = IST_CAPITAL
  ? `${CAPITAL_REGELN}
- Deutsch für Österreich, du-Form, klar und ermutigend, ohne Floskeln.
- Ergebnis sofort verwendbar. Keine Einleitung wie "Hier ist…".`
  : REGELN_AGENTUR;

export function lernText(notizen: string[]) {
  if (!notizen.length) return "";
  return `\nLERNNOTIZEN (Rückmeldungen dieses Kunden zu früheren Ergebnissen – unbedingt berücksichtigen):\n${notizen.map((n) => "- " + n).join("\n")}\n`;
}

export function agentPrompt(agent: Agent, profil: Profil, briefing: Record<string, string>, ueberarbeitung?: { vorher: string; hinweise: string }, notizen: string[] = []) {
  const basis = `${IST_CAPITAL ? `Du bist der ZEWI-Capital-Mentor "${agent.name}" – ein erfahrener, verantwortungsvoller Trading-Ausbilder.` : `Du bist der ZEWI-Agent "${agent.name}" – ein erfahrener Marketing-Profi für kleine und mittlere Betriebe in Österreich.`}

${IST_CAPITAL ? "TRADER-PROFIL DES LERNENDEN" : "MARKENPROFIL DES KUNDEN"}:
${profilText(profil)}

AUFTRAG:
${agent.auftrag(briefing)}

${IST_CAPITAL ? "" : boardWissen(agent.id)}
${!IST_CAPITAL && (istGesundheit(profil) || agent.bereich === "Gesundheit & Energetik") ? "\n" + GESUNDHEIT_REGELN + "\n" : ""}${!IST_CAPITAL && (istFenster(profil) || agent.bereich === "Fenster & Türen") ? "\n" + FENSTER_REGELN + "\n" : ""}${lernText(notizen)}
${REGELN}`;
  if (!ueberarbeitung) return basis;
  return `${basis}

ÜBERARBEITUNG: Hier ist die vorige Fassung. Überarbeite sie gezielt nach diesen Hinweisen und gib die KOMPLETTE neue Fassung aus.
HINWEISE:
${ueberarbeitung.hinweise}

VORIGE FASSUNG:
${ueberarbeitung.vorher}`;
}

export type Pruefung = { score: number; maengel: string[] };

export async function pruefen(agent: Agent, profil: Profil, briefing: Record<string, string>, ergebnis: string, notizen: string[] = []): Promise<Pruefung> {
  const prompt = `Du bist die strenge Qualitätsprüfung von ${IST_CAPITAL ? "ZEWI Capital (Lernplattform, KEINE Anlageberatung – jede Kauf-/Verkaufsempfehlung, Prognose oder Signal ist ein K.-o.-Mangel, Score max. 3)" : "der ZEWI-Agentur"}. Bewerte dieses Ergebnis des Agenten "${agent.name}".

MARKENPROFIL:
${profilText(profil)}

AUFTRAG:
${agent.auftrag(briefing)}

PRÜFKRITERIEN:
${agent.pruefkriterien}${notizen.length ? "\nDie Lernnotizen des Kunden müssen eingehalten sein:\n" + notizen.map((n) => "- " + n).join("\n") : ""}
Außerdem: Vollständigkeit laut Auftrag, Umsetzung der ZEWI-Board-Prinzipien (starker Einstieg, ein klarer nächster Schritt, Nutzen statt Leistung, nichts Überflüssiges), Markenton, keine erfundenen Fakten, rechtlich unbedenklich für Österreich, sofort verwendbar.
Zeichenbegrenzungen bitte wirklich nachzählen.${!IST_CAPITAL && (istGesundheit(profil) || agent.bereich === "Gesundheit & Energetik") ? "\nGESUNDHEITSWERBUNG: Jedes Heilversprechen, jeder Krankheitsname als Werbeaussage oder medizinische Begriff (Therapie, Patient, Behandlung) bei Energetik ist ein K.-o.-Mangel (Score max. 4)." : ""}${!IST_CAPITAL && (istFenster(profil) || agent.bereich === "Fenster & Türen") ? "\nFENSTER-BRANCHE: Erfundene Einsparzahlen, Förderbeträge oder technische Werte ohne Angabe im Profil/Briefing sind K.-o.-Mängel (Score max. 4)." : ""}

ERGEBNIS:
${ergebnis.slice(0, 60000)}

Antworte NUR mit JSON: {"score": 1-10, "maengel": ["konkreter Mangel mit Stelle und wie zu beheben", "..."]}
score 9-10 = kann so raus. Unter 9 = muss überarbeitet werden.`;
  const t = await frage(prompt, 1500);
  try {
    const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    const s = fence ? fence[1] : t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1);
    const j = JSON.parse(s);
    return { score: Math.max(1, Math.min(10, Number(j.score) || 1)), maengel: Array.isArray(j.maengel) ? j.maengel.map(String) : [] };
  } catch {
    return { score: 7, maengel: ["Qualitätsprüfung konnte nicht gelesen werden – bitte selbst prüfen."] };
  }
}

/** Kompletter Ablauf: Agent → Prüfung (≥ 9/10) → bei Bedarf 1 Überarbeitung → erneute Prüfung. */
export async function produzieren(
  agent: Agent,
  profil: Profil,
  briefing: Record<string, string>,
  aenderung?: { vorher: string; wunsch: string },
  notizen: string[] = [],
) {
  let runden = 1;
  const tokens = agent.schnell ? 3000 : 8000;
  const schwelle = agent.schnell ? 8 : 9; // Alltags-Agenten: schneller, Überarbeitung nur bei echten Mängeln
  let ergebnis = await frage(
    agentPrompt(agent, profil, briefing, aenderung ? { vorher: aenderung.vorher, hinweise: `Änderungswunsch des Kunden: ${aenderung.wunsch}` } : undefined, notizen),
    tokens,
  );
  let qa = await pruefen(agent, profil, briefing, ergebnis, notizen);
  if (qa.score < schwelle && qa.maengel.length) {
    runden++;
    ergebnis = await frage(agentPrompt(agent, profil, briefing, { vorher: ergebnis, hinweise: qa.maengel.map((m) => "- " + m).join("\n") }, notizen), tokens);
    qa = await pruefen(agent, profil, briefing, ergebnis, notizen);
  }
  return { ergebnis, qa, runden };
}

export type Plan = { agent: string; titel: string; begruendung: string; briefing: Record<string, string> };

/** Content Planner / Zentrale: freie Idee -> passender Agent + vorausgefülltes Briefing. */
export async function planen(idee: string, profil: Profil, agenten: Agent[]): Promise<Plan> {
  const katalog = agenten.map((a) => ({
    id: a.id,
    name: a.name,
    wofuer: a.kurz,
    felder: a.felder.map((f) => ({ key: f.key, label: f.label, ...(f.optionen ? { optionen: f.optionen } : {}), pflicht: !!f.pflicht })),
  }));
  const prompt = `Du bist die ZEWI-Zentrale. Ein Kunde beschreibt in eigenen Worten, was er braucht. Wähle den EINEN passenden Agenten und fülle dessen Briefing-Felder so gut wie möglich aus der Idee und dem Markenprofil aus.

IDEE DES KUNDEN:
"${idee.slice(0, 2000)}"

MARKENPROFIL:
${profilText(profil)}

AGENTEN:
${JSON.stringify(katalog)}

REGELN:
- Bei Auswahlfeldern NUR einen Wert aus "optionen" verwenden.
- Nichts erfinden (keine Preise, Termine, Namen). Unbekanntes leer lassen ("").
- "titel": kurzer Titel für den Auftrag (max. 60 Zeichen).
- "begruendung": 1 Satz, warum dieser Agent.

Antworte NUR mit JSON: {"agent":"<id>","titel":"...","begruendung":"...","briefing":{"<key>":"<wert>"}}`;
  const t = await frage(prompt, 1200, process.env.ZEWI_MODELL_SCHNELL || "claude-haiku-5-5");
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  const j = JSON.parse(fence ? fence[1] : t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
  const agent = agenten.find((a) => a.id === j.agent) ?? agenten[0];
  const briefing: Record<string, string> = {};
  for (const f of agent.felder) {
    const v = String(j.briefing?.[f.key] ?? "").trim();
    briefing[f.key] = f.optionen ? (f.optionen.includes(v) ? v : "") : v;
  }
  return { agent: agent.id, titel: String(j.titel ?? "").slice(0, 90), begruendung: String(j.begruendung ?? ""), briefing };
}
