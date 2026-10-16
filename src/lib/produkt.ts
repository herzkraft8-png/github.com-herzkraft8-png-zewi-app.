/**
 * Ein Code, zwei Produkte:
 *   NEXT_PUBLIC_ZEWI_PRODUKT=agentur  -> ZEWI Agentur (Marketing für Betriebe)
 *   NEXT_PUBLIC_ZEWI_PRODUKT=capital  -> ZEWI Capital Akademie (Trading lernen, keine Signale)
 * Jedes Produkt wird als eigene Vercel-App mit eigener Supabase-Datenbank betrieben.
 */
export type ProduktId = "agentur" | "capital";
export const PRODUKT: ProduktId = process.env.NEXT_PUBLIC_ZEWI_PRODUKT === "capital" ? "capital" : "agentur";
export const IST_CAPITAL = PRODUKT === "capital";

type ProfilFeld = { key: string; label: string; ph: string; lang?: boolean; req?: boolean };

export const TEXTE = IST_CAPITAL
  ? {
      marke: "ZEWI Capital Akademie",
      kurz: "ZEWI Capital",
      titel: "ZEWI Capital Akademie – Trading lernen mit KI-Mentoren",
      beschreibung: "Price Action, Handelsplan, Risiko und Psychologie lernen – mit 15 KI-Mentoren. Lernplattform, keine Anlageberatung, keine Signale.",
      pill: "✦ Lernen statt Signale",
      heroA: "Deine Trading-Ausbildung",
      heroB: "mit KI-Mentoren.",
      lead: "Charts lesen, Handelsplan schreiben, Risiko beherrschen, Disziplin trainieren. Jeder Mentor kennt Dein Trader-Profil und prüft Dich gegen Deine eigenen Regeln.",
      profilName: "Trader-Profil",
      profilEyebrow: "Trader-Profil",
      profilText: "Alles, was die Mentoren über Dich als Trader wissen. Je ehrlicher, desto besser die Lernhilfe.",
      kundenprofile: "Profile",
      risiko:
        "Wichtiger Hinweis: ZEWI Capital ist eine Lernplattform. Es werden keine Anlageberatung, keine Kauf- oder Verkaufsempfehlungen und keine Signale erteilt. Der Handel mit Devisen, CFDs und anderen Hebelprodukten ist mit hohen Risiken bis zum Totalverlust verbunden. Die meisten Privatanleger verlieren mit Hebelprodukten Geld.",
    }
  : {
      marke: "ZEWI Agentur",
      kurz: "ZEWI",
      titel: "ZEWI – Deine Marketing-Agentur mit KI",
      beschreibung: "Posts, Werbeanzeigen, Reels, Blogartikel, Newsletter, Angebote und Kundenmails – erstellt von KI-Agenten, geprüft vor der Freigabe. Für Betriebe in Österreich.",
      pill: "✦ Für Betriebe in Österreich",
      heroA: "Deine Marketing-Agentur",
      heroB: "mit KI-Agenten.",
      lead: "Posts, Werbeanzeigen, Reels, Blogartikel, Newsletter und Stellenanzeigen – erstellt in Deiner Sprache, geprüft vor der Freigabe. Du entscheidest, was veröffentlicht wird.",
      profilName: "KI-Zwilling",
      profilEyebrow: "KI-Zwilling",
      profilText: "Alles, was die Agenten über diesen Betrieb wissen. Nur echte Angaben – die Agenten erfinden nichts dazu.",
      kundenprofile: "Kundenprofile",
      risiko: "",
    };

/** Gleiche Datenbank-Spalten, je Produkt andere Bedeutung. */
export const PROFIL_FELDER: ProfilFeld[] = IST_CAPITAL
  ? [
      { key: "name", label: "Name des Profils", ph: "z. B. Mein Trading", req: true },
      { key: "firma", label: "Dein Vorname", ph: "z. B. Alois" },
      { key: "branche", label: "Erfahrung", ph: "z. B. Anfänger / 1 Jahr Demo / 3 Jahre live", req: true },
      { key: "ort", label: "Märkte", ph: "z. B. EUR/USD, DAX, Gold" },
      { key: "plattformen", label: "Plattform & Broker / Prop-Firm", ph: "z. B. TradingView, MetaTrader 5, FTMO-Challenge" },
      { key: "frequenz", label: "Zeiteinheiten & Handelszeiten", ph: "z. B. H4 und H1, 8–11 Uhr" },
      { key: "website", label: "Kontogröße (optional)", ph: "z. B. 10.000 € Demo / 100.000 $ Challenge" },
      { key: "angebot", label: "Dein Handelsplan / Deine Strategie", ph: "Welche Setups handelst Du, wann steigst Du ein und aus? (Stichworte reichen)", lang: true, req: true },
      { key: "besonderheiten", label: "Deine Risikoregeln", ph: "z. B. max. 1 % pro Trade, max. 3 % Tagesverlust, nach 2 Verlusten Pause", lang: true },
      { key: "tabus", label: "Regeln der Challenge / des Kontos", ph: "z. B. max. Tagesverlust, max. Gesamtverlust, Gewinnziel – aus den aktuellen Bedingungen Deines Anbieters", lang: true },
      { key: "zielgruppe", label: "Deine Schwächen & Lernziele", ph: "z. B. steige zu früh ein, Revenge-Trading, will Marktstruktur besser verstehen", lang: true },
      { key: "ton", label: "Wie willst Du lernen?", ph: "z. B. kurz und direkt, viele Übungen, mit Quiz", lang: true },
    ]
  : [
      { key: "name", label: "Name des Kundenprofils", ph: "z. B. Malerei Huber", req: true },
      { key: "firma", label: "Name des Betriebs", ph: "z. B. Malerei Huber GmbH", req: true },
      { key: "branche", label: "Branche", ph: "z. B. Malerbetrieb", req: true },
      { key: "ort", label: "Ort / Einzugsgebiet", ph: "z. B. Kirchdorf an der Krems, 30 km Umkreis" },
      { key: "website", label: "Website", ph: "https://…" },
      { key: "plattformen", label: "Kanäle", ph: "z. B. Instagram, Facebook, Google-Profil" },
      { key: "frequenz", label: "Wie oft posten?", ph: "z. B. 3× pro Woche" },
      { key: "angebot", label: "Was bietet Ihr an?", ph: "Leistungen, Spezialgebiete, typische Aufträge, Preissegment", lang: true, req: true },
      { key: "zielgruppe", label: "Wer sind Eure Kunden?", ph: "z. B. Hausbesitzer 35–65, Hausverwaltungen", lang: true },
      { key: "ton", label: "Wie klingt Ihr? (Tonalität & Persönlichkeit)", ph: "z. B. bodenständig, herzlich, mit Humor", lang: true },
      { key: "besonderheiten", label: "Was macht Euch besonders? (Alleinstellung)", ph: "Familienbetrieb seit …, Meisterbetrieb, schnelle Termine", lang: true },
      { key: "tabus", label: "Verbotene Wörter & Themen", ph: "z. B. billig, günstig, Rabattschlacht", lang: true },
    ];

/** Feste Regeln, die jeder Capital-Mentor und die Qualitätsprüfung einhalten (Österreich: FMA, WAG 2018). */
export const CAPITAL_REGELN = `ZEWI-CAPITAL-REGELN (Österreich, FMA/WAG 2018) – zwingend:
- Du bist Lehrer und Mentor, KEIN Anlageberater. Keine Kauf-/Verkaufsempfehlung, keine Einstiegs-/Ausstiegspreise, keine Kursziele, keine Signale, keine Prognosen zu einem echten, aktuellen Markt – auch nicht "hypothetisch".
- Beispiele immer mit erfundenen, klar als Beispiel markierten Zahlen ("Beispiel: Einstieg bei 100, Stop bei 98").
- Bewerte nie, ob ein Trade "richtig" ist – nur, ob er zu den EIGENEN Regeln des Nutzers passt.
- Keine Gewinnversprechen. Erwähne bei Hebelprodukten das hohe Verlustrisiko.
- Bei Anzeichen von Spielsucht, Schulden oder Verzweiflung: Pause empfehlen, auf Hilfe hinweisen (z. B. Spielsuchthilfe Österreich), nicht weiter coachen.
- Kein Kursmaterial Dritter wiedergeben; nur allgemein anerkanntes Lehrwissen.
- Am Ende jedes Lernblocks: "Lernhilfe, keine Anlageberatung."`;
