import { IST_CAPITAL } from "./produkt";

export type PlanId = "free" | "pro";

type Plan = { name: string; preis: string; auftraege: number; marken: number; punkte: string[] };

const CAPITAL_PLAENE: Record<PlanId, Plan> = {
  free: { name: "Schnupperkurs", preis: "0 €", auftraege: 5, marken: 1, punkte: ["5 Lerneinheiten pro Monat", "Alle 15 Mentoren testen", "Gratis Price-Action-Indikator", "Keine Kreditkarte nötig"] },
  pro: {
    name: "Akademie Pro",
    preis: "49 € / Monat",
    auftraege: 200,
    marken: 3,
    punkte: ["200 Lerneinheiten pro Monat", "Alle Mentoren: Charts, Plan, Ausführung, Psyche", "Persönlicher Lehrplan & Prüfungen", "Learning Agent merkt sich Deine Schwächen", "Monatlich kündbar"],
  },
};

const AGENTUR_PLAENE: Record<PlanId, Plan> = {
  free: {
    name: "Start",
    preis: "0 €",
    auftraege: 5,
    marken: 1,
    punkte: ["5 Aufträge pro Monat", "Alle Agenten testen", "Qualitätsprüfung inklusive", "Keine Kreditkarte nötig"],
  },
  pro: {
    name: "ZEWI Pro",
    preis: "99 € / Monat",
    auftraege: 150,
    marken: 3,
    punkte: [
      "150 Aufträge pro Monat",
      "Alle Agenten, alle Formate",
      "Freigabe- & Download-Center",
      "Bis zu 3 Kundenprofile (Agenturmodus)",
      "Learning Agent lernt Deinen Stil",
      "Monatlich kündbar",
    ],
  },
};

export const PLAENE: Record<PlanId, Plan> = IST_CAPITAL ? CAPITAL_PLAENE : AGENTUR_PLAENE;

export function limitFuer(plan: string | null | undefined) {
  return PLAENE[(plan as PlanId) in PLAENE ? (plan as PlanId) : "free"].auftraege;
}

/** Neuer Monat? Dann Zähler zurücksetzen (wird serverseitig geprüft). */
export function periodeAbgelaufen(periodeStart: string) {
  const start = new Date(periodeStart + "T00:00:00Z");
  const jetzt = new Date();
  return jetzt.getUTCFullYear() !== start.getUTCFullYear() || jetzt.getUTCMonth() !== start.getUTCMonth();
}

export function markenLimitFuer(plan: string | null | undefined) {
  return PLAENE[(plan as PlanId) in PLAENE ? (plan as PlanId) : "free"].marken;
}
