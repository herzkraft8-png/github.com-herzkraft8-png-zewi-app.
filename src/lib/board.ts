/**
 * ZEWI Board: Expertenwissen (Billion-Dollar-Board) als feste Arbeitsregeln für die Agenten.
 * Angepasst an kleine Betriebe in Österreich: ehrlich, ohne Fake-Knappheit, ohne Druckverkauf,
 * rechtlich sauber (keine unerlaubte Werbung per Mail/Telefon, keine Heil-/Gewinnversprechen).
 */

export const EXPERTEN = {
  hormozi: `ALEX HORMOZI – Angebot & Wert
- Wertgleichung: Wert = (Traumergebnis × Wahrscheinlichkeit) ÷ (Wartezeit × Aufwand). Jeder Text erhöht Traumergebnis/Wahrscheinlichkeit oder senkt Wartezeit/Aufwand.
- Ergebnis statt Leistung verkaufen ("trockener Keller in 2 Tagen" statt "Kellerabdichtung").
- Risiko nehmen: Garantie oder klare Zusage – nur, wenn der Betrieb sie wirklich geben kann (sonst Platzhalter [Garantie?]).
- Angebote und Boni bekommen Namen ("Herbst-Sicherheits-Check" statt "Wartung").`,
  cardone: `GRANT CARDONE – Verkauf & Nachfassen
- Das Glück liegt im Nachfassen: jede Kommunikation endet mit einem klaren, kleinen nächsten Schritt.
- Einwände sind Fragen nach mehr Information: anerkennen → eingrenzen ("Ist das der einzige Punkt?") → mit Nutzen beantworten.
- Alternativ-Frage statt Ja/Nein ("Passt Ihnen Dienstag oder Donnerstag?").
- In Österreich: kein Druck, keine unerlaubten Werbe-Mails/-Anrufe, nur bestehende Kontakte oder Einwilligung.`,
  mrtech: `MR. TECH – Auffallen & Wiedererkennen
- Wer nicht auffällt, fällt weg: klare Meinung statt neutralem Allerlei – provokant, nie toxisch, nie gegen Personen.
- Wiedererkennungs-Element (Satz, Farbe, Ritual) in jedem Beitrag wiederholen.
- Hook-Formel: steile These → Begründung → Lösung → einfacher nächster Schritt.
- Echte FOMO nur mit echtem Grund (Termin, Saison, begrenzte Kapazität) – nie erfundene Knappheit.`,
  garyvee: `GARY VEE – Content & Persönlichkeit
- Dokumentieren statt inszenieren: echte Einblicke aus dem Betrieb (Baustelle, Team, Werkstatt) schlagen Hochglanz.
- 4:1-Regel: 4 Beiträge mit Mehrwert, dann 1 Angebot.
- Plattform-gerecht schreiben (Instagram visuell, LinkedIn fachlich-menschlich, Google lokal-sachlich).
- Menschen kaufen von Menschen: Inhaber/Team zeigen.`,
  musk: `ELON MUSK – Einfach & 10× besser
- Erst streichen, dann optimieren: jedes Wort, das nichts beiträgt, fliegt raus.
- Ein Hebel, in dem der Betrieb 10× besser ist (schneller, einfacher, persönlicher) – den klar herausstellen.
- Mission: Wofür steht der Betrieb, wogegen kämpft er? (z. B. "gegen Pfusch am Bau").`,
  brunson: `RUSSELL BRUNSON – Funnel & Wertetreppe
- Jede Seite/Mail hat genau EIN Ziel und EINEN Aufruf.
- Wertetreppe: kostenloses Erstangebot → kleiner Einstieg → Hauptleistung → Premium.
- Geschichte verkauft: Ausgangslage → Wendepunkt → Ergebnis (Kundenbeispiel nur mit echten Daten, sonst Platzhalter).
- Newsletter wie eine kleine Serie mit Spannungsbogen.`,
  mrbeast: `MRBEAST – Verpackung & Aufmerksamkeit
- Verpackung zuerst: Titel/Hook/Thumbnail entscheiden, ob überhaupt jemand schaut.
- Die ersten 3 Sekunden: sofort Problem, Frage oder Überraschung – keine Begrüßung.
- Neugier-Lücke: genug verraten für Interesse, nicht genug für die Antwort – aber das Versprechen IMMER einlösen (kein Clickbait).
- Steigerung: das Beste nicht an den Anfang, offene Schleifen bis zum Schluss.
- Konkret statt vage: Zahlen, Orte, Details.`,
  robbins: `TONY ROBBINS – Bedürfnisse & Entscheidung
- Menschen kaufen Sicherheit, Bedeutung, Wachstum, Verbindung: Texte sprechen das stärkste Bedürfnis der Zielgruppe an (Handwerkskunden meist Sicherheit: "pünktlich, sauber, fixer Preis").
- Begeisterte Fans statt zufriedener Kunden: kleine unerwartete Extras erwähnen, wenn es sie gibt.
- Klare Entscheidung leicht machen: ein Schritt, kein Wenn und Aber.`,
} as const;

type Key = keyof typeof EXPERTEN;

/** Welche Experten welchem Agenten am meisten bringen. */
const ZUORDNUNG: Record<string, Key[]> = {
  social: ["garyvee", "mrbeast", "mrtech"],
  reel: ["mrbeast", "mrtech", "garyvee"],
  youtube: ["mrbeast", "brunson"],
  meta_ads: ["hormozi", "mrbeast", "robbins"],
  google_ads: ["hormozi", "musk"],
  blog: ["brunson", "musk"],
  newsletter: ["brunson", "garyvee"],
  bewertung: ["robbins", "cardone"],
  recruiting: ["hormozi", "garyvee"],
  kundenmail: ["cardone", "robbins"],
  angebot: ["hormozi", "cardone"],
  mahnung: ["cardone", "robbins"],
  google_post: ["musk", "garyvee"],
  kommentar: ["garyvee", "robbins"],
  wochenplan: ["garyvee", "mrbeast"],
  flyer: ["hormozi", "mrbeast", "musk"],
  grand_slam: ["hormozi", "robbins", "musk"],
  einwaende: ["cardone", "robbins", "hormozi"],
  heil_check: ["musk"],
  fenster_anfrage: ["cardone", "robbins"],
  fenster_angebot: ["hormozi", "cardone", "robbins"],
  fenster_aufmass: ["robbins", "musk"],
  fenster_referenz: ["garyvee", "brunson", "mrbeast"],
  fenster_saison: ["mrbeast", "hormozi", "garyvee"],
  fenster_wartung: ["hormozi", "brunson"],
  praxis_web: ["brunson", "robbins", "garyvee"],
  klienten_info: ["robbins", "cardone"],
  gutschein: ["hormozi", "mrbeast"],
  workshop: ["brunson", "mrtech"],
  kooperation: ["hormozi", "cardone"],
  board: ["hormozi", "cardone", "mrtech", "garyvee", "musk", "brunson", "mrbeast", "robbins"],
};

export function boardWissen(agentId: string) {
  const keys = ZUORDNUNG[agentId] ?? ["musk"];
  return `ZEWI-BOARD – arbeite nach diesen erprobten Prinzipien (nie die Namen der Experten im Ergebnis nennen, außer bei der Board-Beratung):
${keys.map((k) => EXPERTEN[k]).join("\n\n")}`;
}
