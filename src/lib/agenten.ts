import { CAPITAL_AGENTEN } from "./agenten-capital";
import { IST_CAPITAL } from "./produkt";
import { STUDIO_AGENTEN } from "./agenten-studio";
export type Feld = {
  key: string;
  label: string;
  typ: "text" | "textarea" | "select";
  optionen?: string[];
  placeholder?: string;
  pflicht?: boolean;
};

export type Agent = {
  id: string;
  name: string;
  bereich: string;
  schnell?: boolean;
  kurz: string;
  liefert: string[];
  felder: Feld[];
  auftrag: (b: Record<string, string>) => string;
  pruefkriterien: string;
};

const ZIEL = ["Anfragen / Leads", "Verkäufe", "Bekanntheit", "Termine", "Mitarbeiter finden"];


export const AGENTUR_AGENTEN: Agent[] = [
  // ---------- FENSTER & TÜREN (Fenster, Haustüren, Sonnenschutz, Wintergärten) ----------
  {
    id: "fenster_anfrage",
    name: "Anfrage beantworten & qualifizieren",
    bereich: "Fenster & Türen",
    schnell: true,
    kurz: "Antwort auf eine Fenster-Anfrage mit den richtigen Rückfragen – damit das Angebot schnell und passend wird.",
    liefert: ["Antwort-Mail", "WhatsApp-Kurzversion", "Rückfrage-Checkliste", "Terminvorschlag fürs Aufmaß"],
    felder: [
      { key: "anfrage", label: "Anfrage des Kunden", typ: "textarea", pflicht: true, placeholder: "z. B. Wir möchten 8 alte Holzfenster tauschen, Haus Baujahr 1978 …" },
      { key: "termine", label: "Freie Aufmaß-Termine (optional)", typ: "text", placeholder: "z. B. Di 14 Uhr, Do 9 Uhr" },
    ],
    auftrag: (b) => `Beantworte diese Anfrage an einen Fensterbetrieb und qualifiziere sie.
ANFRAGE: "${b.anfrage}"
Freie Termine: ${b.termine || "[Terminvorschläge]"}

Liefere in Markdown:
## Antwort-Mail (Betreff, max. 160 Wörter, Dank, kurz Vertrauen aufbauen, 3–5 wichtigste Rückfragen, Aufmaß-Termin als Alternativ-Frage)
## WhatsApp-Kurzversion (max. 60 Wörter)
## Rückfrage-Checkliste fürs Angebot
Anzahl & ungefähre Maße, Material (Kunststoff/Holz/Holz-Alu/Alu), Baujahr & Zustand, Rollläden/Raffstore/Insektenschutz, Fensterbänke innen/außen, Montage (Altbau/Neubau), Etage/Zugang, Wunschtermin, Förderinteresse.
## Interne Notiz
Wie heiß ist die Anfrage (A/B/C) und warum.`,
    pruefkriterien: "Freundlich und schnell, nur sinnvolle Rückfragen, klarer nächster Schritt (Aufmaß), keine erfundenen Preise.",
  },
  {
    id: "fenster_angebot",
    name: "Angebot verständlich erklären",
    bereich: "Fenster & Türen",
    kurz: "Übersetzt Dein technisches Fenster-Angebot in Kundensprache – mit Begleitmail und Nachfass-Plan.",
    liefert: ["Angebots-Zusammenfassung in Alltagssprache", "Begleitmail", "Antworten auf 6 typische Einwände", "Nachfass-Mails Tag 4 und 10"],
    felder: [
      { key: "positionen", label: "Angebotspositionen (Stichworte oder einfügen)", typ: "textarea", pflicht: true, placeholder: "z. B. 8 Kunststofffenster 3-fach, Uw 0,8, RAL-Montage, Raffstore Süd, Summe [€]" },
      { key: "kunde", label: "Kunde", typ: "text", placeholder: "z. B. Familie Maier, Einfamilienhaus" },
    ],
    auftrag: (b) => `Erkläre dieses Fenster-Angebot in Kundensprache.
Kunde: ${b.kunde || "[Kunde]"}
POSITIONEN:
${b.positionen}

Liefere in Markdown:
## Ihr Angebot auf einen Blick
Tabelle: Was | Was das für Sie bedeutet (Alltagssprache: wärmer, leiser, sicherer, weniger Zugluft, einfacher zu putzen).
## Begleitmail (max. 150 Wörter)
## 6 typische Einwände & Antworten
z. B. zu teuer, Kunststoff vs. Holz, Dreck beim Tausch, Dauer, Schimmel nach Tausch (Lüften), Förderung.
## Nachfass-Mail Tag 4 (max. 70 Wörter) und Tag 10 (max. 70 Wörter)`,
    pruefkriterien: "Technik korrekt und einfach erklärt, keine erfundenen Werte oder Einsparzahlen, Förderung nur mit Platzhalter, freundliches Nachfassen ohne Druck.",
  },
  {
    id: "fenster_aufmass",
    name: "Aufmaß- & Montage-Infos für Kunden",
    bereich: "Fenster & Türen",
    schnell: true,
    kurz: "Was Kunden vor Aufmaß und Montagetag wissen müssen – nimmt Angst vor Dreck, Lärm und Chaos.",
    liefert: ["Info vor dem Aufmaß", "Info vor dem Montagetag (Checkliste)", "Nach der Montage: Lüften & Pflege", "Erinnerung 1 Tag vorher"],
    felder: [
      { key: "ablauf", label: "Wie läuft Eure Montage ab?", typ: "textarea", placeholder: "z. B. Team mit 2 Monteuren, ca. 1 Fenster pro Stunde, Abdeckung, Entsorgung inkl." },
    ],
    auftrag: (b) => `Schreibe Kundeninfos für Aufmaß und Montage.
Ablauf laut Betrieb: ${b.ablauf || "[Ablauf eintragen]"}

Liefere in Markdown:
## Vor dem Aufmaß (Mail, max. 120 Wörter)
## Vor dem Montagetag (Checkliste: Vorhänge ab, Fensterbänke frei räumen, Zugang, Haustiere, Parkplatz …)
## Nach der Montage (Lüften gegen Kondenswasser/Schimmel in Alltagssprache, Pflege von Dichtungen und Beschlägen, Garantie-Hinweis als Platzhalter)
## Erinnerung 1 Tag vorher (SMS, max. 40 Wörter)`,
    pruefkriterien: "Beruhigend und praktisch, nur Angaben aus dem Ablauf, Lüften korrekt erklärt.",
  },
  {
    id: "fenster_referenz",
    name: "Projekt-Story (Vorher/Nachher)",
    bereich: "Fenster & Türen",
    kurz: "Aus einem abgeschlossenen Auftrag wird eine Referenz für Website, Instagram und Google.",
    liefert: ["Referenz-Text für die Website", "Instagram-Karussell (Vorher/Nachher)", "Google-Profil-Beitrag", "Foto-Checkliste"],
    felder: [
      { key: "projekt", label: "Was wurde gemacht?", typ: "textarea", pflicht: true, placeholder: "z. B. Altbau 1965 in Kirchdorf, 12 Holz-Alu-Fenster, neue Haustür, Raffstore" },
      { key: "zitat", label: "Echtes Kundenzitat (nur mit Einverständnis, optional)", typ: "text" },
    ],
    auftrag: (b) => `Mach aus diesem Projekt eine Referenz.
Projekt: ${b.projekt}
Kundenzitat: ${b.zitat || "keins – Platzhalter [Zitat mit Einverständnis]"}

Liefere in Markdown:
## Referenz-Text (Website, 120–180 Wörter: Ausgangslage → Lösung → Ergebnis in Alltagsworten)
## Instagram-Karussell (6 Folien: Vorher, Herausforderung, Montage, Detail, Nachher, Aufruf) + Caption mit lokalen Hashtags
## Google-Profil-Beitrag (80–120 Wörter, Ort nennen, keine Hashtags)
## Foto-Checkliste für die Baustelle (gleicher Blickwinkel vorher/nachher, Details, Team)
Hinweis: Fotos vom Haus nur mit Zustimmung der Eigentümer veröffentlichen.`,
    pruefkriterien: "Nur echte Projektdaten, keine erfundenen Einsparungen, Zustimmungs-Hinweis vorhanden, lokale Suchbegriffe.",
  },
  {
    id: "fenster_saison",
    name: "Saison-Kampagne",
    bereich: "Fenster & Türen",
    kurz: "Fertige Kampagne für die richtige Jahreszeit – Herbst-Check, Sonnenschutz, Insektenschutz, Einbruchschutz.",
    liefert: ["Kampagnen-Idee mit Namen", "3 Social-Posts", "Meta-Anzeige", "Flyer/Postwurf-Text", "Google-Profil-Beitrag"],
    felder: [
      { key: "thema", label: "Kampagne", typ: "select", optionen: ["Herbst: Fenster-Check & Dichtungen", "Winter: Zugluft & Heizkosten", "Frühjahr: Insektenschutz", "Sommer: Sonnenschutz & Hitze", "Herbst/Winter: Einbruchschutz (Zeitumstellung)", "Haustür-Aktion"], pflicht: true },
      { key: "aktion", label: "Konkretes Angebot (optional)", typ: "text", placeholder: "z. B. Fenster-Check [Preis], Gratis-Beratung bis [Datum]" },
    ],
    auftrag: (b) => `Erstelle eine Saison-Kampagne: ${b.thema}
Angebot: ${b.aktion || "selbst ein passendes, ehrliches Angebot vorschlagen (mit Platzhaltern)"}

Liefere in Markdown:
## Kampagne (Name, Zielgruppe, Zeitraum, Kernbotschaft)
## 3 Social-Posts (Hook, Text, Aufruf, Bildidee, Hashtags mit Ort)
## Meta-Anzeige (Primärtext, Headline max. 40 Zeichen, Creative-Idee)
## Flyer / Postwurf (Headline, 3 Punkte, Aufruf, Kontakt-Platzhalter)
## Google-Profil-Beitrag
Bei Einbruchschutz: keine Angst-Mache, keine Kriminalitätsstatistiken erfinden.`,
    pruefkriterien: "Saisonlogisch, ehrlich ohne Angst-Mache, keine erfundenen Zahlen/Förderungen, klarer Aufruf.",
  },
  {
    id: "fenster_wartung",
    name: "Wartungs-Abo entwickeln",
    bereich: "Fenster & Türen",
    kurz: "Aus Einmal-Kunden werden Stammkunden: ein Fenster-Wartungsservice mit Name, Leistungen, Preisidee und Texten.",
    liefert: ["Service-Paket mit Name", "Leistungsumfang", "Preis-Logik", "Brief an Bestandskunden", "Website-Abschnitt"],
    felder: [
      { key: "leistungen", label: "Was könnt Ihr bei einer Wartung machen?", typ: "textarea", placeholder: "z. B. Beschläge einstellen und ölen, Dichtungen pflegen, Entwässerung prüfen" },
      { key: "kunden", label: "Wie viele Bestandskunden habt Ihr ungefähr?", typ: "text" },
    ],
    auftrag: (b) => `Entwickle einen wiederkehrenden Fenster-Wartungsservice.
Mögliche Leistungen: ${b.leistungen || "aus Branche ableiten, als Vorschlag markieren"}
Bestandskunden: ${b.kunden || "[Anzahl]"}

Liefere in Markdown:
## Das Paket (Name, Rhythmus, Leistungen als Liste, was der Kunde davon hat)
## Preis-Logik (Kalkulationsschema mit Platzhaltern: Zeit pro Fenster, Anfahrt, Material – keine erfundenen Preise)
## Brief an Bestandskunden (max. 200 Wörter, per Post; Mail nur an Kunden mit Einwilligung)
## Website-Abschnitt (80–120 Wörter)
## Rechenbeispiel Umsatz (mit Platzhaltern: Kunden × Quote × Preis)`,
    pruefkriterien: "Nutzen klar, Preise nur als Schema, rechtlich korrekter Kanal für Bestandskunden, umsetzbar für kleinen Betrieb.",
  },

  // ---------- GESUNDHEIT & ENERGETIK (z. B. Craniosacral, Massage, Kosmetik, Coaching) ----------
  {
    id: "heil_check",
    name: "Heilversprechen-Check",
    bereich: "Gesundheit & Energetik",
    schnell: true,
    kurz: "Text einfügen – der Agent markiert riskante Aussagen und schreibt sie rechtssicherer um.",
    liefert: ["Ampel je Aussage", "Begründung", "Sichere Neufassung des ganzen Textes"],
    felder: [
      { key: "text", label: "Dein Text (Website, Post, Flyer …)", typ: "textarea", pflicht: true },
      { key: "beruf", label: "Deine Berufsgrundlage", typ: "select", optionen: ["Humanenergetik / Energetik", "Massage (gewerblich)", "Kosmetik", "Lebens- und Sozialberatung", "Physiotherapie / Gesundheitsberuf", "Ärztin / Arzt", "Weiß nicht"] },
    ],
    auftrag: (b) => `Prüfe diesen Werbetext auf rechtlich riskante Gesundheitsaussagen (Österreich).
Berufsgrundlage: ${b.beruf || "Weiß nicht"}
TEXT:
"""${b.text}"""

Liefere in Markdown:
## Ampel
Tabelle: Aussage (Zitat) | Ampel (🔴 riskant / 🟡 prüfen / 🟢 ok) | Warum | Bessere Formulierung.
## Sichere Neufassung
Der komplette Text, umgeschrieben – gleiche Länge und gleicher Ton, ohne Heilversprechen.
## Hinweis
Was der Betrieb sich bei WKO / Berufsverband bestätigen lassen sollte. Keine Rechtsberatung.`,
    pruefkriterien: "Alle Heilversprechen und medizinischen Begriffe gefunden, Neufassung vollständig und natürlich, Hinweis auf fachliche Prüfung.",
  },
  {
    id: "praxis_web",
    name: "Praxis-Website-Texte",
    bereich: "Gesundheit & Energetik",
    kurz: "Startseite, Über mich, Methode, Ablauf, Preise und FAQ – einfühlsam und ohne Heilversprechen.",
    liefert: ["Startseite", "Über mich", "Die Methode erklärt", "Ablauf einer Sitzung", "Preise & Gutscheine", "FAQ (8 Fragen)", "SEO-Titel & Meta"],
    felder: [
      { key: "methode", label: "Deine Methode(n)", typ: "text", pflicht: true, placeholder: "z. B. Craniosacral-Anwendung, Fußreflexzonen-Massage" },
      { key: "weg", label: "Dein Weg & Deine Ausbildung (echt)", typ: "textarea", placeholder: "Warum machst Du das, welche Ausbildungen, seit wann" },
      { key: "rahmen", label: "Ort, Dauer, Preise", typ: "text", placeholder: "z. B. Praxis in Kirchdorf, 60 Min., [Preis]" },
    ],
    auftrag: (b) => `Schreibe die Website-Texte einer Praxis.
Methode: ${b.methode}
Weg & Ausbildung: ${b.weg || "[eigene Geschichte einsetzen]"}
Rahmen: ${b.rahmen || "[Ort], [Dauer], [Preis]"}

Liefere in Markdown die Abschnitte: Startseite (Headline, Unterzeile, 3 Nutzen in Worten des Wohlbefindens, Aufruf), Über mich (Ich-Form, warm, 150–200 Wörter), Die Methode (verständlich, ohne Heilversprechen), Ablauf einer Sitzung (Schritt für Schritt), Preise & Gutscheine, FAQ (8 Fragen inkl. "Ersetzt das einen Arztbesuch?" mit klarer Antwort), SEO-Titel (max. 60 Zeichen) und Meta-Beschreibung (140–155 Zeichen) mit Ort.`,
    pruefkriterien: "Warm und vertrauensvoll, keine Heilversprechen, Pflicht-Hinweis enthalten, Ausbildung nicht erfunden, Ort für lokale Suche enthalten.",
  },
  {
    id: "klienten_info",
    name: "Klienten-Infos & Nachsorge",
    bereich: "Gesundheit & Energetik",
    schnell: true,
    kurz: "Infos vor dem ersten Termin, Hinweise danach, Absage-Regeln – als Mail und WhatsApp-Text.",
    liefert: ["Willkommens-Mail vor dem 1. Termin", "Nach-der-Sitzung-Nachricht", "Absage- & Ausfallregeln", "Erinnerung 24 h vorher"],
    felder: [
      { key: "ablauf", label: "Wie läuft eine Sitzung bei Dir ab?", typ: "textarea", placeholder: "z. B. bekleidet auf der Liege, 60 Min., Vorgespräch" },
      { key: "absage", label: "Deine Absage-Regel", typ: "text", placeholder: "z. B. kostenlos bis 24 h vorher" },
    ],
    auftrag: (b) => `Schreibe Klienten-Kommunikation für eine Praxis.
Ablauf: ${b.ablauf || "[Ablauf]"}
Absage-Regel: ${b.absage || "[Absage-Regel]"}

Liefere in Markdown:
## Willkommens-Mail vor dem ersten Termin (Betreff, max. 150 Wörter: Anfahrt [Platzhalter], was mitbringen, Ablauf, Hinweis, dass die Anwendung keine ärztliche Abklärung ersetzt)
## Erinnerung 24 h vorher (SMS/WhatsApp, max. 40 Wörter)
## Nachricht nach der Sitzung (einfühlsam, allgemeine Wohlfühl-Tipps wie Ruhe gönnen, keine Gesundheitsversprechen, Einladung zum nächsten Termin)
## Absage- & Ausfallregeln (klar und freundlich formuliert)`,
    pruefkriterien: "Warm, kurz, keine Gesundheitsversprechen, Platzhalter statt erfundener Fakten, Hinweis auf ärztliche Abklärung.",
  },
  {
    id: "gutschein",
    name: "Gutschein & Anlass-Aktion",
    bereich: "Gesundheit & Energetik",
    schnell: true,
    kurz: "Geschenkgutscheine für Weihnachten, Muttertag oder Geburtstag – Gutscheintext, Post und Aushang.",
    liefert: ["Gutschein-Text", "Social-Post", "Aushang/Flyer-Text", "Bestell-Ablauf"],
    felder: [
      { key: "anlass", label: "Anlass", typ: "select", optionen: ["Weihnachten", "Muttertag", "Valentinstag", "Geburtstag", "Ganzjährig"] },
      { key: "angebot", label: "Was kann man verschenken?", typ: "text", pflicht: true, placeholder: "z. B. 60-Min.-Sitzung [Preis], 3er-Block" },
    ],
    auftrag: (b) => `Erstelle eine Gutschein-Aktion zum Anlass "${b.anlass || "Weihnachten"}".
Angebot: ${b.angebot}

Liefere in Markdown:
## Gutschein-Text (Vorderseite: Titel + 1 Satz; Rückseite: was enthalten ist, Gültigkeit [Platzhalter], Kontakt)
## Social-Post (Hook, 60–90 Wörter, Aufruf, 5 Hashtags mit Ort)
## Aushang-Text (Headline max. 6 Wörter, 3 Zeilen, Aufruf)
## Bestell-Ablauf (einfach: Nachricht/Anruf → Bezahlung → Gutschein per Post oder PDF)`,
    pruefkriterien: "Schenk-Gefühl statt Gesundheitsversprechen, Gültigkeit als Platzhalter, klarer Bestellweg.",
  },
  {
    id: "workshop",
    name: "Kurs- & Workshop-Ankündigung",
    bereich: "Gesundheit & Energetik",
    kurz: "Ankündigung für Kurse, Workshops oder Abende – Text, Post, Anmelde-Infos und Erinnerung.",
    liefert: ["Ankündigungstext", "Social-Post + Story-Idee", "Anmelde-Infos", "Erinnerungs-Nachricht"],
    felder: [
      { key: "thema", label: "Thema des Kurses", typ: "text", pflicht: true, placeholder: "z. B. Achtsamkeitsabend, Babymassage-Kurs" },
      { key: "daten", label: "Datum, Ort, Preis, Plätze", typ: "text", placeholder: "z. B. 14.11., 18:30, Praxis, [Preis], max. 8" },
    ],
    auftrag: (b) => `Kündige diesen Kurs/Workshop an.
Thema: ${b.thema}
Daten: ${b.daten || "[Datum] [Ort] [Preis] [Plätze]"}

Liefere in Markdown:
## Ankündigungstext (Website/Newsletter, 120–180 Wörter: für wen, was erwartet einen, was mitbringen)
## Social-Post + Story-Idee
## Anmelde-Infos (Ablauf, Storno-Regel als Platzhalter)
## Erinnerung 2 Tage vorher (max. 50 Wörter)`,
    pruefkriterien: "Daten exakt übernommen, keine Heilversprechen, echte statt erfundener Knappheit (Plätze nur wenn angegeben).",
  },
  {
    id: "kooperation",
    name: "Kooperations-Anfrage",
    bereich: "Gesundheit & Energetik",
    kurz: "Brief an mögliche Partner (Hebammen, Physios, Yoga-Studios, Hotels) – persönlich, ohne Werbe-Spam.",
    liefert: ["Brief/Anschreiben", "Gesprächsleitfaden fürs Kennenlernen", "Ideen für Zusammenarbeit"],
    felder: [
      { key: "partner", label: "An wen?", typ: "text", pflicht: true, placeholder: "z. B. Hebammenpraxis, Yoga-Studio, Wellnesshotel" },
      { key: "idee", label: "Deine Idee für die Zusammenarbeit (optional)", typ: "textarea" },
    ],
    auftrag: (b) => `Schreibe eine Kooperations-Anfrage an: ${b.partner}
Idee: ${b.idee || "selbst 3 passende Ideen vorschlagen"}

Liefere in Markdown:
## Brief (Post oder persönlich übergeben; max. 200 Wörter, Nutzen für den Partner zuerst)
## 3 Ideen für die Zusammenarbeit (z. B. gemeinsamer Abend, Gutschein-Kooperation, Empfehlungskarten)
## Gesprächsleitfaden für das Kennenlernen (5 Fragen)
Hinweis: Werbe-Mails ohne vorherige Zustimmung sind in Österreich nicht erlaubt – Brief, Anruf bei bestehendem Kontakt oder persönlicher Besuch.`,
    pruefkriterien: "Nutzen für Partner im Vordergrund, kein Spam-Ton, keine Heilversprechen, rechtlicher Hinweis zum Kanal.",
  },

  // ---------- STRATEGIE: das ZEWI-Board ----------
  {
    id: "grand_slam",
    name: "Unwiderstehliches Angebot",
    bereich: "Strategie",
    kurz: "Aus Deiner Leistung wird ein Angebot mit Namen, Nutzen, Garantie und Boni – nach Alex Hormozi.",
    liefert: ["Angebots-Name", "Wertgleichung", "Garantie-Vorschlag", "3 Boni", "Preisanker", "Text für Website & Flyer"],
    felder: [
      { key: "leistung", label: "Welche Leistung willst Du besser verkaufen?", typ: "text", pflicht: true, placeholder: "z. B. Heizungswartung, Gesichtsbehandlung, Steuererklärung" },
      { key: "preis", label: "Aktueller Preis (optional)", typ: "text" },
      { key: "problem", label: "Was hält Kunden heute vom Kauf ab?", typ: "textarea", placeholder: "z. B. zu teuer, kein Vertrauen, keine Zeit" },
    ],
    auftrag: (b) => `Entwickle ein unwiderstehliches Angebot für diese Leistung.
Leistung: ${b.leistung}
Aktueller Preis: ${b.preis || "[Preis]"}
Kaufhindernisse: ${b.problem || "selbst aus Markenprofil und Branche ableiten"}

Liefere in Markdown:
## Traumergebnis des Kunden (1 Satz)
## Probleme → Lösungen
Tabelle: Problem/Einwand des Kunden | Lösung im Angebot (mind. 6 Zeilen).
## Das Angebot
**Name** (einprägsam, max. 5 Wörter), Kernleistung, was genau enthalten ist.
## Wertgleichung
Wie das Angebot Traumergebnis und Wahrscheinlichkeit erhöht und Wartezeit und Aufwand senkt – je 1–2 konkrete Punkte.
## Garantie
2 Varianten (eine bedingungslose, eine bedingte). Hinweis: nur anbieten, wenn der Betrieb sie wirklich einhalten kann.
## 3 Boni mit Namen
Die Boni sollen einen echten Nutzen haben und dem Betrieb wenig kosten.
## Preisanker
Wie man den Preis einordnet (Vergleich mit Alternative, Kosten des Nichtstuns), ohne Fantasiewerte – Platzhalter für Zahlen.
## Knappheit – nur echt
Echte Gründe (Kapazität, Saison, Termin) oder "keine".
## Fertige Texte
Website-Abschnitt (80–120 Wörter) und Flyer-Text (Headline + 3 Punkte + Aufruf).`,
    pruefkriterien: "Ergebnis statt Leistung, Garantie realistisch und als prüfbedürftig markiert, keine erfundenen Zahlen, Boni konkret, echte statt erfundener Knappheit.",
  },
  {
    id: "einwaende",
    name: "Einwände & Verkaufsgespräch",
    bereich: "Strategie",
    kurz: "Gesprächsleitfaden mit Antworten auf typische Einwände – ehrlich und ohne Druck.",
    liefert: ["Gesprächsleitfaden", "Antworten auf 8 Einwände", "Abschlussfragen", "Nachfass-Plan"],
    felder: [
      { key: "angebot", label: "Was verkaufst Du im Gespräch?", typ: "text", pflicht: true },
      { key: "einwaende", label: "Welche Einwände hörst Du oft? (optional)", typ: "textarea", placeholder: "z. B. Zu teuer. Ich muss das mit meiner Frau besprechen. Später." },
      { key: "kanal", label: "Wo findet das Gespräch statt?", typ: "select", optionen: ["Vor Ort beim Kunden", "Telefon (Kunde hat angefragt)", "Im Geschäft", "Videocall"] },
    ],
    auftrag: (b) => `Erstelle einen Leitfaden für ein Verkaufsgespräch.
Angebot: ${b.angebot}
Bekannte Einwände: ${b.einwaende || "typische Einwände der Branche selbst ableiten"}
Situation: ${b.kanal || "Vor Ort beim Kunden"} – der Kunde hat Interesse gezeigt.

Liefere in Markdown:
## Gesprächsleitfaden (5 Phasen)
Einstieg, Bedarf fragen (5 gute Fragen), Lösung zeigen (Nutzen statt Technik), Angebot, Abschluss.
## 8 Einwände und Antworten
Je Einwand: was eigentlich dahintersteckt, Antwort (anerkennen → eingrenzen → Nutzen), max. 60 Wörter. Ehrlich, ohne Druck oder Manipulation.
## 3 Abschlussfragen
Als Alternativ-Fragen formuliert.
## Nachfass-Plan
Tag 1, 3, 7, 14: Kanal und Text – nur an Kunden, die angefragt oder ein Angebot erhalten haben.`,
    pruefkriterien: "Respektvoll und ohne Druck, keine unerlaubte Kaltakquise, Antworten kurz und natürlich gesprochen, Nachfassen nur bei bestehenden Kontakten.",
  },
  {
    id: "board",
    name: "Board-Beratung",
    bereich: "Strategie",
    kurz: "Dein Problem im Betrieb, beantwortet von 8 Business-Legenden – mit konkretem Plan für die nächsten 30 Tage.",
    liefert: ["Diagnose", "Rat der passenden Experten", "30-Tage-Plan", "Kennzahlen zum Messen"],
    felder: [
      { key: "frage", label: "Wo drückt der Schuh?", typ: "textarea", pflicht: true, placeholder: "z. B. Zu wenig Anfragen im Winter. Oder: Wir finden keine Mitarbeiter." },
      { key: "stand", label: "Was hast Du schon probiert?", typ: "textarea" },
      { key: "ziel", label: "Woran merkst Du in 90 Tagen, dass es geklappt hat?", typ: "text", placeholder: "z. B. 10 Anfragen pro Woche" },
      { key: "budget", label: "Budget pro Monat", typ: "select", optionen: ["fast nichts", "bis 300 €", "300–1.000 €", "über 1.000 €"] },
    ],
    auftrag: (b) => `Berate diesen Betrieb als ZEWI-Board mit 8 Business-Legenden (Hormozi, Cardone, Mr. Tech, Gary Vee, Musk, Brunson, MrBeast, Robbins).
Herausforderung: ${b.frage}
Schon probiert: ${b.stand || "nichts angegeben"}
Ziel in 90 Tagen: ${b.ziel || "nicht angegeben – selbst ein realistisches, messbares Ziel vorschlagen"}
Budget: ${b.budget || "unbekannt"}

Liefere in Markdown:
## Diagnose
Das eigentliche Problem in 2–3 Sätzen (oft ist es nicht das, was der Kunde vermutet). Welche Annahmen du triffst, klar benennen.
## Das Board berät
Die 2–3 passendsten Experten, je: **Name – Prinzip**, Anwendung auf genau diesen Betrieb, 1 konkretes Beispiel.
## Der Plan für 30 Tage
Woche 1–4, je 2–3 Aufgaben (machbar für einen kleinen Betrieb, passend zum Budget).
## Messen
3 Kennzahlen mit Zielwert und wie man sie misst.
## Was du NICHT tun solltest
2–3 Fallen.
## Passende ZEWI-Agenten
Welche Agenten aus dem Studio als nächstes helfen.
Hinweis bei Recht/Steuern/Finanzen: Fachperson beiziehen.`,
    pruefkriterien: "Konkret für diesen Betrieb statt allgemeiner Ratschläge, realistisch fürs Budget, Annahmen offen genannt, keine Erfolgsversprechen, rechtlich sauber für Österreich.",
  },

  // ---------- ALLTAG: kleine Agenten für jeden Tag (schnell, ohne Überarbeitungsrunde) ----------
  {
    id: "kundenmail",
    name: "Kundenmail beantworten",
    bereich: "Alltag",
    schnell: true,
    kurz: "Mail oder Nachricht einfügen, fertige Antwort zurückbekommen.",
    liefert: ["Antwort zum Kopieren", "Kurzfassung für WhatsApp"],
    felder: [
      { key: "nachricht", label: "Nachricht des Kunden", typ: "textarea", pflicht: true },
      { key: "ziel", label: "Was willst Du erreichen?", typ: "text", placeholder: "z. B. Termin anbieten, freundlich absagen, Preis nennen" },
      { key: "fakten", label: "Fakten für die Antwort", typ: "textarea", placeholder: "Termine, Preise, Bedingungen – nur was stimmt" },
    ],
    auftrag: (b) => `Beantworte diese Kundennachricht.
NACHRICHT: "${b.nachricht}"
ZIEL: ${b.ziel || "freundlich und hilfreich antworten"}
FAKTEN (nur diese verwenden): ${b.fakten || "keine – fehlende Angaben als [Platzhalter]"}

Liefere in Markdown:
## Antwort (E-Mail)
Mit Betreffzeile, Anrede, max. 150 Wörter, klarer nächster Schritt, Gruß mit [Name].
## Kurzfassung (WhatsApp/SMS)
Max. 50 Wörter.`,
    pruefkriterien: "Beantwortet alle Fragen der Nachricht, nur gegebene Fakten, klarer nächster Schritt, passender Ton.",
  },
  {
    id: "angebot",
    name: "Angebotstext",
    bereich: "Alltag",
    schnell: true,
    kurz: "Aus Stichworten wird ein überzeugender Angebotstext mit Begleitmail.",
    liefert: ["Angebotseinleitung", "Leistungsbeschreibung", "Begleitmail", "Nachfass-Mail nach 5 Tagen"],
    felder: [
      { key: "kunde", label: "Für wen?", typ: "text", placeholder: "z. B. Familie Maier, Hausverwaltung XY", pflicht: true },
      { key: "leistung", label: "Leistungen in Stichworten", typ: "textarea", pflicht: true },
      { key: "preis", label: "Preis / Konditionen", typ: "text", placeholder: "z. B. 4.890 € inkl. MwSt., gültig 30 Tage" },
    ],
    auftrag: (b) => `Schreibe Angebotstexte.
Kunde: ${b.kunde}
Leistungen: ${b.leistung}
Preis/Konditionen: ${b.preis || "[Preis]"}

Liefere in Markdown:
## Einleitung fürs Angebot (3–4 Sätze, Bezug auf das Gespräch: [Datum])
## Leistungsbeschreibung (verständlich, Nutzen statt Fachchinesisch, als Liste)
## Begleitmail zum Angebot (max. 120 Wörter)
## Nachfass-Mail nach 5 Tagen (max. 80 Wörter, freundlich, ohne Druck)`,
    pruefkriterien: "Preis exakt wie angegeben, keine zusätzlichen Leistungen erfunden, verständlich für Laien.",
  },
  {
    id: "mahnung",
    name: "Zahlungserinnerung",
    bereich: "Alltag",
    schnell: true,
    kurz: "Freundliche Erinnerung, 1. und 2. Mahnung – bestimmt, aber kundenfreundlich.",
    liefert: ["Freundliche Erinnerung", "1. Mahnung", "2. Mahnung"],
    felder: [
      { key: "rechnung", label: "Rechnung (Nr., Datum, Betrag)", typ: "text", pflicht: true, placeholder: "z. B. Nr. 2026-118 vom 1.10., 1.240 €" },
      { key: "kunde", label: "Kunde", typ: "text" },
      { key: "beziehung", label: "Beziehung zum Kunden", typ: "select", optionen: ["Stammkunde", "Neukunde", "Firmenkunde"] },
    ],
    auftrag: (b) => `Schreibe drei Texte für eine offene Rechnung.
Rechnung: ${b.rechnung}
Kunde: ${b.kunde || "[Kunde]"}
Beziehung: ${b.beziehung || "Stammkunde"}

Liefere in Markdown:
## Freundliche Zahlungserinnerung (Zahlungsziel: [Datum], Bankverbindung als [IBAN])
## 1. Mahnung (14 Tage später)
## 2. Mahnung (bestimmt; Hinweis auf mögliche Mahnspesen und Verzugszinsen nur allgemein, ohne Beträge zu erfinden)
Jeweils max. 120 Wörter, mit Betreff.`,
    pruefkriterien: "Betrag und Rechnungsnummer exakt übernommen, Ton steigt angemessen, keine erfundenen Gebühren, rechtlich vorsichtig.",
  },
  {
    id: "google_post",
    name: "Google-Profil-Post",
    bereich: "Alltag",
    schnell: true,
    kurz: "Kurzer Beitrag für Dein Google-Unternehmensprofil – gut für lokale Suche.",
    liefert: ["2 Beiträge à max. 1500 Zeichen", "Button-Vorschlag", "Fotoidee"],
    felder: [
      { key: "thema", label: "Thema", typ: "text", placeholder: "z. B. Herbst-Check, neues Projekt, Öffnungszeiten Feiertage", pflicht: true },
    ],
    auftrag: (b) => `Schreibe 2 Beiträge für das Google-Unternehmensprofil.
Thema: ${b.thema}

Liefere in Markdown, je Beitrag:
## Beitrag 1 / Beitrag 2
Text 80–150 Wörter, Ort und Leistung natürlich erwähnen (lokale Suche), keine Hashtags, keine Telefonnummer im Text (Google lehnt das oft ab).
**Button:** (Anrufen / Mehr erfahren / Buchen / Angebot)
**Fotoidee:** echtes Foto aus dem Betrieb.`,
    pruefkriterien: "Ort und Leistung erwähnt, keine Hashtags, keine Telefonnummer im Text, passender Button.",
  },
  {
    id: "kommentar",
    name: "Kommentar-Antworten",
    bereich: "Alltag",
    schnell: true,
    kurz: "Antworten auf Kommentare und Direktnachrichten in Social Media.",
    liefert: ["Antwort je Kommentar", "Hinweis bei heiklen Kommentaren"],
    felder: [
      { key: "kommentare", label: "Kommentare (einer pro Zeile)", typ: "textarea", pflicht: true },
      { key: "post", label: "Worum ging es im Beitrag?", typ: "text" },
    ],
    auftrag: (b) => `Schreibe Antworten auf diese Social-Media-Kommentare.
Beitrag: ${b.post || "unbekannt"}
KOMMENTARE:
${b.kommentare}

Liefere in Markdown je Kommentar: den Kommentar kurz zitiert, darunter die Antwort (max. 40 Wörter, natürlich, mit Frage zurück wenn passend). Bei Beschwerden: ruhig, Lösung per Direktnachricht anbieten. Bei Beleidigung/Spam: Empfehlung "ausblenden" statt Antwort.`,
    pruefkriterien: "Jeder Kommentar beantwortet, kurz, natürlich, keine Diskussion in der Öffentlichkeit bei Beschwerden.",
  },
  {
    id: "wochenplan",
    name: "Content-Wochenplan",
    bereich: "Alltag",
    schnell: true,
    kurz: "Was poste ich diese Woche? Plan für 5 Tage mit Themen, Format und Hook.",
    liefert: ["5 Tage Plan", "Format je Tag", "Hook je Beitrag"],
    felder: [
      { key: "woche", label: "Besonderheiten dieser Woche", typ: "text", placeholder: "z. B. Feiertag, Aktion, Messe" },
      { key: "kanaele", label: "Kanäle", typ: "select", optionen: ["Instagram + Facebook", "Instagram", "Facebook", "LinkedIn", "TikTok"] },
    ],
    auftrag: (b) => `Erstelle einen Content-Wochenplan (Montag–Freitag).
Kanäle: ${b.kanaele || "Instagram + Facebook"}
Besonderheiten: ${b.woche || "keine"}

Liefere eine Markdown-Tabelle: Tag | Thema | Format (Post/Karussell/Reel/Story) | Hook (erste Zeile) | Ziel.
Mischung: 4 Mehrwert-Beiträge, 1 Angebots-Beitrag. Darunter 3 Tipps, wie man die Beiträge mit wenig Aufwand produziert.`,
    pruefkriterien: "5 Tage, Mischung 4:1 Mehrwert zu Angebot, konkrete Hooks, umsetzbar ohne Profi-Equipment.",
  },
  {
    id: "flyer",
    name: "Flyer & Aushang",
    bereich: "Alltag",
    schnell: true,
    kurz: "Texte für Flyer, Plakat, Gutschein oder Aushang im Geschäft.",
    liefert: ["Headline-Varianten", "Flyer-Text Vorder- & Rückseite", "Gestaltungsidee"],
    felder: [
      { key: "anlass", label: "Anlass", typ: "text", placeholder: "z. B. Tag der offenen Tür, Gutschein, Eröffnung", pflicht: true },
      { key: "infos", label: "Infos (Datum, Ort, Angebot)", typ: "textarea" },
    ],
    auftrag: (b) => `Schreibe Flyer-Texte.
Anlass: ${b.anlass}
Infos: ${b.infos || "[Datum] [Ort] [Angebot]"}

Liefere in Markdown:
## 5 Headlines (max. 6 Wörter)
## Vorderseite (Headline, Unterzeile, 3 Nutzenpunkte, Aufruf)
## Rückseite (Details, Kontakt als Platzhalter, ggf. QR-Code-Hinweis)
## Gestaltungsidee (Bild, Farben aus der Marke, Format A5/A6)`,
    pruefkriterien: "Kurze, lesbare Headlines, alle Infos korrekt übernommen, klarer Aufruf.",
  },

  {
    id: "social",
    name: "Social-Media-Paket",
    bereich: "Social Media",
    kurz: "Posts, Karussell und Story für eine Woche, fertig zum Posten.",
    liefert: ["3 Feed-Posts", "1 Karussell (6 Folien)", "3 Story-Ideen", "Hashtags & Bildideen"],
    felder: [
      { key: "thema", label: "Thema oder Anlass", typ: "text", placeholder: "z. B. Herbstaktion, neues Projekt, Tipp der Woche", pflicht: true },
      { key: "plattform", label: "Plattform", typ: "select", optionen: ["Instagram", "Facebook", "LinkedIn", "Instagram + Facebook"] },
      { key: "ziel", label: "Ziel", typ: "select", optionen: ZIEL },
      { key: "extra", label: "Was soll unbedingt rein?", typ: "textarea", placeholder: "Aktion, Termin, Besonderheit …" },
    ],
    auftrag: (b) => `Erstelle ein Social-Media-Paket für ${b.plattform || "Instagram"}.
Thema: ${b.thema}
Ziel: ${b.ziel || "Anfragen / Leads"}
Zusätzlich: ${b.extra || "–"}

Liefere in Markdown:
## 3 Feed-Posts
Je Post: **Hook** (max. 10 Wörter), Text (60–120 Wörter), **Aufruf**, **Bildidee** (mit Handy machbar), **Hashtags** (5–8, davon 2 lokal).
## Karussell (6 Folien)
Folie 1 = Hook, Folien 2–5 = Inhalt, Folie 6 = Aufruf. Pro Folie: Überschrift (max. 6 Wörter) + 1–2 Zeilen Text. Dazu die Caption.
## 3 Story-Ideen
Je Story: was zu sehen ist, Text auf dem Bild, interaktives Element (Umfrage, Frage, Quiz, Link).`,
    pruefkriterien: "Hooks konkret und kurz, Aufruf in jedem Post, lokale Hashtags, keine erfundenen Fakten oder Preise, passt zur Marke.",
  },
  {
    id: "meta_ads",
    name: "Meta-Ads-Werbepaket",
    bereich: "Werbung",
    kurz: "Werbepaket für Facebook & Instagram: Texte, Headlines, Creative und Verkaufsreel.",
    liefert: ["3 Anzeigentexte", "3 Headlines", "1 Handlungsaufruf", "Creative-Brief 1:1", "Verkaufsreel-Skript 9:16", "Zielgruppen-Vorschlag"],
    felder: [
      { key: "angebot", label: "Was wird beworben?", typ: "textarea", placeholder: "Angebot, Preis/Aktion, Gültigkeit", pflicht: true },
      { key: "ziel", label: "Kampagnenziel", typ: "select", optionen: ["Leads", "Verkäufe", "Bekanntheit", "Traffic", "Recruiting"] },
      { key: "region", label: "Region", typ: "text", placeholder: "z. B. Bezirk Kirchdorf, 30 km um Linz, ganz Österreich" },
      { key: "freebie", label: "Lockangebot (optional)", typ: "text", placeholder: "z. B. Gratis-Check, Rabatt, Checkliste" },
    ],
    auftrag: (b) => `Erstelle ein Meta-Ads-Werbepaket (Facebook + Instagram).
Angebot: ${b.angebot}
Ziel: ${b.ziel || "Leads"}
Region: ${b.region || "aus dem Markenprofil"}
Lockangebot: ${b.freebie || "keins"}

Liefere in Markdown:
## Zielgruppe
Alter, Interessen, Region, Ausschlüsse – als Vorschlag für den Werbeanzeigenmanager.
## 3 Anzeigentexte (Primärtext)
A: Problem → Lösung, B: Nutzen/Ergebnis, C: Social Proof mit Platzhalter [Kundenstimme]. Je 50–125 Wörter, erste Zeile = Hook.
## 3 Headlines (max. 40 Zeichen, Zeichenzahl in Klammern dahinter)
## Handlungsaufruf
Passender Meta-Button + Satz.
## Creative 1:1
Bildbeschreibung, Text auf dem Bild (max. 7 Wörter), Farben. Plus ein englischer Bild-Prompt für ein KI-Bildtool.
## Verkaufsreel 9:16 (20–30 Sekunden)
Szenen mit Zeitmarken: gesprochener Text, Text auf dem Bild, Bild.
## Hinweise
Was vor dem Schalten zu prüfen ist (Sonderkategorien bei Recruiting/Wohnen/Kredit, Landingpage, Impressum).`,
    pruefkriterien: "Headlines max. 40 Zeichen, drei klar unterschiedliche Ansätze, keine unbelegten Superlative oder Heilversprechen, Meta-Werberichtlinien beachtet (keine persönlichen Merkmale ansprechen wie 'Bist du übergewichtig?').",
  },
  {
    id: "google_ads",
    name: "Google-Ads-Kampagne",
    bereich: "Werbung",
    kurz: "Suchanzeige mit 15 Headlines, 4 Beschreibungen, Keywords und Ausschlüssen.",
    liefert: ["15 Headlines (max. 30 Zeichen)", "4 Beschreibungen (max. 90 Zeichen)", "Keywords nach Übereinstimmung", "Ausschluss-Keywords", "Erweiterungen"],
    felder: [
      { key: "leistung", label: "Welche Leistung soll gefunden werden?", typ: "text", placeholder: "z. B. Badsanierung, Steuerberatung, Hochzeitsfotos", pflicht: true },
      { key: "region", label: "Region", typ: "text", placeholder: "z. B. Linz und Umgebung" },
      { key: "budget", label: "Tagesbudget (optional)", typ: "text", placeholder: "z. B. 20 €" },
      { key: "usp", label: "Was macht Euch besser?", typ: "textarea" },
    ],
    auftrag: (b) => `Erstelle eine Google-Ads-Suchkampagne (responsive Suchanzeige).
Leistung: ${b.leistung}
Region: ${b.region || "aus dem Markenprofil"}
Tagesbudget: ${b.budget || "nicht angegeben"}
Vorteile: ${b.usp || "aus dem Markenprofil"}

Liefere in Markdown:
## Kampagnen-Aufbau
Kampagnentyp, Gebotsstrategie-Empfehlung für den Start, Standort-Einstellung ("Präsenz").
## 15 Headlines
Nummeriert, jede MAX. 30 Zeichen inkl. Leerzeichen, Zeichenzahl in Klammern dahinter. Mischung: Leistung+Ort, Nutzen, Vertrauen, Aufruf.
## 4 Beschreibungen
Jede MAX. 90 Zeichen, Zeichenzahl in Klammern.
## Keywords
Tabelle: Keyword | Übereinstimmung (passend/Wortgruppe/genau) | Begründung. 15–25 Stück.
## Ausschluss-Keywords
15+ Stück (z. B. gratis, job, selber machen …), passend zur Branche.
## Erweiterungen
4 Sitelinks (Titel max. 25 Zeichen + 2 Zeilen à max. 35), 4 Callouts (max. 25), Snippet-Vorschlag.`,
    pruefkriterien: "JEDE Headline max. 30 Zeichen und jede Beschreibung max. 90 Zeichen – nachzählen! Zeichenzahlen stimmen, Keywords relevant, Ausschlüsse sinnvoll.",
  },
  {
    id: "reel",
    name: "Instagram-Reel",
    bereich: "Social Media",
    kurz: "Reel-Skript mit Hook, Szenen, Untertiteln, Caption und Thumbnail-Idee.",
    liefert: ["5 Hooks zur Auswahl", "Skript mit Zeitmarken", "Text auf dem Bild", "Caption & Hashtags", "Thumbnail-Idee"],
    felder: [
      { key: "thema", label: "Thema des Reels", typ: "text", pflicht: true },
      { key: "laenge", label: "Länge", typ: "select", optionen: ["15 Sekunden", "30 Sekunden", "60 Sekunden"] },
      { key: "format", label: "Wer ist im Bild?", typ: "select", optionen: ["Ich spreche selbst in die Kamera", "Nur Bilder/Videos mit Text", "KI-Avatar / KI-Zwilling"] },
      { key: "ziel", label: "Ziel", typ: "select", optionen: ZIEL },
    ],
    auftrag: (b) => `Schreibe ein Instagram-Reel (9:16).
Thema: ${b.thema}
Länge: ${b.laenge || "30 Sekunden"}
Format: ${b.format || "Ich spreche selbst in die Kamera"}
Ziel: ${b.ziel || "Anfragen / Leads"}

Liefere in Markdown:
## 5 Hooks zur Auswahl (Typ fett davor: Frage, Fehler, Zahl, Mythos, Vorher/Nachher)
## Skript
Tabelle: Zeit | Gesprochen | Text auf dem Bild | Bild/Szene. Erste 3 Sekunden = stärkster Hook.
## Untertitel-Hinweis
Wichtige Wörter, die hervorgehoben werden sollen.
## Caption (max. 80 Wörter) + 5 Hashtags
## Thumbnail / Titelbild
Motiv + Text (max. 4 Wörter).`,
    pruefkriterien: "Hook in den ersten 3 Sekunden, Länge passt zur Sekundenzahl (ca. 2,5 Wörter pro Sekunde), klarer Aufruf, gesprochene Sprache.",
  },
  {
    id: "youtube",
    name: "YouTube-Video",
    bereich: "Inhalte",
    kurz: "Skript für 5 oder 10 Minuten mit Titel, Beschreibung, Kapiteln und Thumbnail.",
    liefert: ["3 Titel", "Sprechtext", "Kapitelmarken", "Beschreibung & Keywords", "Thumbnail-Idee"],
    felder: [
      { key: "thema", label: "Thema", typ: "text", pflicht: true },
      { key: "laenge", label: "Länge", typ: "select", optionen: ["5 Minuten", "10 Minuten"] },
      { key: "zuschauer", label: "Was soll der Zuschauer danach können oder tun?", typ: "textarea" },
    ],
    auftrag: (b) => `Schreibe ein YouTube-Video (16:9).
Thema: ${b.thema}
Länge: ${b.laenge || "5 Minuten"} (ca. 140 Wörter pro Minute)
Ergebnis für den Zuschauer: ${b.zuschauer || "versteht das Thema und weiß den nächsten Schritt"}

Liefere in Markdown:
## 3 Titel (max. 60 Zeichen)
## Thumbnail
Motiv, Gesichtsausdruck, Text (max. 4 Wörter).
## Sprechtext
Mit Abschnitts-Überschriften. Intro (Hook + Versprechen in 20 Sekunden), Hauptteil, Aufruf am Ende. Szenen-Hinweise in [eckigen Klammern].
## Kapitelmarken
00:00 Format, geschätzt.
## Beschreibung
150–250 Wörter, erste 2 Zeilen mit Keyword, Platzhalter [LINK].
## Tags / Keywords
10–15.`,
    pruefkriterien: "Wortzahl passt zur Länge, Hook im ersten Satz, Titel max. 60 Zeichen, keine erfundenen Zahlen/Studien.",
  },
  {
    id: "blog",
    name: "Blogartikel (SEO)",
    bereich: "Inhalte",
    kurz: "SEO-Artikel mit Titel, Meta-Beschreibung, Gliederung und FAQ.",
    liefert: ["SEO-Titel & Meta", "Artikel ca. 1000 Wörter", "FAQ", "Interne-Link-Ideen", "Social-Post zum Artikel"],
    felder: [
      { key: "thema", label: "Thema / Frage, die Kunden googeln", typ: "text", pflicht: true },
      { key: "keyword", label: "Hauptkeyword (optional)", typ: "text" },
      { key: "laenge", label: "Länge", typ: "select", optionen: ["ca. 800 Wörter", "ca. 1200 Wörter"] },
    ],
    auftrag: (b) => `Schreibe einen SEO-Blogartikel.
Thema: ${b.thema}
Hauptkeyword: ${b.keyword || "selbst bestimmen"}
Länge: ${b.laenge || "ca. 800 Wörter"}

Liefere in Markdown:
## SEO
- SEO-Titel (max. 60 Zeichen, Zeichenzahl)
- Meta-Beschreibung (140–155 Zeichen, Zeichenzahl)
- URL-Slug
## Artikel
# H1, Einleitung beantwortet die Frage sofort, H2/H3-Struktur, konkrete Schritte und Beispiele aus Österreich, Aufruf am Ende.
## FAQ (3 Fragen)
## Interne Links
3 Vorschläge mit Ankertext.
## Social-Post zum Artikel (60–90 Wörter)`,
    pruefkriterien: "Keyword in Titel/H1/Einleitung, Titel ≤ 60 und Meta 140–155 Zeichen, keine erfundenen Statistiken (sonst [ZAHL PRÜFEN]), gute Lesbarkeit.",
  },
  {
    id: "newsletter",
    name: "Newsletter",
    bereich: "Inhalte",
    kurz: "Newsletter mit Betreffzeilen, Vorschautext und fertigem Text.",
    liefert: ["5 Betreffzeilen", "Vorschautext", "Newsletter-Text", "Aufruf-Button"],
    felder: [
      { key: "anlass", label: "Anlass / Inhalt", typ: "textarea", pflicht: true },
      { key: "ziel", label: "Ziel", typ: "select", optionen: ["Termin buchen", "Angebot nutzen", "Beitrag lesen", "Beziehung pflegen"] },
    ],
    auftrag: (b) => `Schreibe einen Newsletter.
Anlass: ${b.anlass}
Ziel: ${b.ziel || "Beziehung pflegen"}

Liefere in Markdown:
## 5 Betreffzeilen (max. 45 Zeichen) + Vorschautext (max. 90 Zeichen)
## Newsletter
Persönliche Anrede mit Platzhalter [Vorname], 150–300 Wörter, ein Hauptgedanke, ein Aufruf.
## Button-Text (max. 4 Wörter)
## Hinweis
Abmeldelink und Impressum nicht vergessen; nur an Empfänger mit Einwilligung senden.`,
    pruefkriterien: "Betreff ≤ 45 Zeichen, genau ein klarer Aufruf, persönlicher Ton, Hinweis auf Einwilligung vorhanden.",
  },
  {
    id: "bewertung",
    name: "Bewertungs-Antwort",
    bereich: "Kunden & Team",
    kurz: "Drei Antworten auf eine Google-Bewertung – freundlich und datenschutzsicher.",
    liefert: ["3 Antwortvarianten", "Hinweis bei heiklen Fällen"],
    felder: [
      { key: "bewertung", label: "Text der Bewertung", typ: "textarea", pflicht: true },
      { key: "sterne", label: "Sterne", typ: "select", optionen: ["5", "4", "3", "2", "1"] },
      { key: "name", label: "Name des Bewerters (optional)", typ: "text" },
    ],
    auftrag: (b) => `Schreibe drei Antworten auf diese Google-Bewertung (${b.sterne || "5"} Sterne${b.name ? `, von ${b.name}` : ""}):
"${b.bewertung}"

Liefere in Markdown:
## Variante 1 – herzlich
## Variante 2 – kurz
## Variante 3 – sachlich
Jede max. 80 Wörter. Bei Kritik: Verständnis, kein Rechtfertigen, Lösung, Gespräch offline anbieten ([Telefonnummer]). Keine Schuld bei rechtlich heiklen Themen zugeben. Bei Gesundheit/Beauty/Therapie NIE bestätigen, dass die Person Kunde war, keine Behandlungsdetails.
## Hinweis
Nur falls nötig: z. B. "Bewertung wirkt gefälscht – bei Google melden".`,
    pruefkriterien: "Datenschutz eingehalten, kein Streit, konkreter Bezug zur Bewertung, max. 80 Wörter je Variante.",
  },
  {
    id: "recruiting",
    name: "Recruiting-Kampagne",
    bereich: "Kunden & Team",
    kurz: "Stellenanzeige, Recruiting-Ad und Social-Post für eine offene Stelle.",
    liefert: ["Stellenanzeige", "Recruiting-Anzeige (Meta)", "Social-Post", "Kurzbewerbungs-Fragen"],
    felder: [
      { key: "stelle", label: "Welche Stelle?", typ: "text", placeholder: "z. B. Elektriker/in, Servicekraft", pflicht: true },
      { key: "ausmass", label: "Stundenausmaß", typ: "select", optionen: ["Vollzeit", "Teilzeit", "Vollzeit oder Teilzeit", "Lehrstelle"] },
      { key: "gehalt", label: "Gehalt laut KV (und Bereitschaft zur Überzahlung)", typ: "text", placeholder: "z. B. ab 2.800 € brutto lt. KV, Überzahlung möglich" },
      { key: "vorteile", label: "Was bietet Ihr?", typ: "textarea" },
    ],
    auftrag: (b) => `Erstelle eine Recruiting-Kampagne.
Stelle: ${b.stelle} (m/w/d)
Ausmaß: ${b.ausmass || "Vollzeit"}
Gehalt: ${b.gehalt || "[Gehalt lt. KV]"}
Vorteile: ${b.vorteile || "aus dem Markenprofil ableiten, sonst Platzhalter"}

Liefere in Markdown:
## Stellenanzeige
Titel (m/w/d), Einleitung, Aufgaben, Das bringst du mit, Das bieten wir, Gehaltsangabe (in Österreich Pflicht: Mindestentgelt laut KV + Hinweis auf Überzahlungsbereitschaft), Bewerbung (einfach, ohne Anschreiben).
## Recruiting-Anzeige Meta
Primärtext (60–100 Wörter), Headline (max. 40 Zeichen), Bildidee. Hinweis: Sonderkategorie "Beschäftigung" bei Meta auswählen.
## Social-Post (Mitarbeiter gesucht)
## 3 Kurzbewerbungs-Fragen
Für ein einfaches Bewerbungsformular.`,
    pruefkriterien: "m/w/d, Gehaltsangabe nach österreichischem Recht vorhanden, keine diskriminierenden Formulierungen (Alter, Geschlecht, Herkunft), konkret statt Floskeln.",
  },
];

export const AGENTEN: Agent[] = IST_CAPITAL ? CAPITAL_AGENTEN : [...AGENTUR_AGENTEN, ...STUDIO_AGENTEN];

/** Bereiche in der gewünschten Reihenfolge. */
export const BEREICHE: string[] = IST_CAPITAL
  ? ["1 · Charts lesen", "2 · Handel planen", "3 · Ausführung", "Mentaltraining", "Lernen", "Marketing"]
  : ["Strategie", "Alltag", "Social Media", "Werbung", "Inhalte", "Website", "Verkaufsseite", "SEO-Artikel", "Design & Bilder", "Marke", "Lokal & Google", "Immobilien", "Kunden & Team", "Fenster & Türen", "Gesundheit & Energetik"];

export function agentById(id: string) {
  return AGENTEN.find((a) => a.id === id);
}
