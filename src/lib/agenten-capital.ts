import type { Agent } from "./agenten";

const MAERKTE = ["Forex (Währungen)", "Indizes (z. B. DAX)", "Rohstoffe (z. B. Gold)", "Aktien", "Krypto"];
const STUFE = ["Anfänger", "Fortgeschritten", "Profi"];

/** ZEWI Capital Akademie: 15 Mentoren. Lernen statt Signale. */
export const CAPITAL_AGENTEN: Agent[] = [
  // ---------- 1 · CHARTS LESEN ----------
  {
    id: "marktstruktur",
    name: "Marktstruktur-Coach",
    bereich: "1 · Charts lesen",
    kurz: "Trend, Hochs und Tiefs, Unterstützung und Widerstand, Zeiteinheiten – Schritt für Schritt mit Übungen.",
    liefert: ["Erklärung mit Text-Skizzen", "Typische Fehler", "3 Übungen mit Lösung"],
    felder: [
      { key: "thema", label: "Was willst Du lernen?", typ: "select", optionen: ["Trend erkennen (höhere Hochs/Tiefs)", "Unterstützung & Widerstand", "Strukturbruch & Trendwechsel", "Seitwärtsphasen (Range)", "Mehrere Zeiteinheiten kombinieren", "Liquidität & Fehlausbrüche"] },
      { key: "stufe", label: "Dein Stand", typ: "select", optionen: STUFE },
      { key: "frage", label: "Konkrete Frage (optional)", typ: "textarea" },
    ],
    auftrag: (b) => `Unterrichte das Thema "${b.thema || "Trend erkennen"}" für einen ${b.stufe || "Anfänger"}.
Frage des Lernenden: ${b.frage || "keine"}

Liefere in Markdown:
## Das Wichtigste in 3 Sätzen
## Erklärung
Mit einfachen ASCII-Skizzen des Kursverlaufs (z. B. /\\/\\/ ) und klar markierten Beispielzahlen.
## So erkennst Du es im Chart (Checkliste)
## 5 typische Fehler
## 3 Übungen
Je Aufgabe mit Beispielzahlen; die Lösungen getrennt unter "## Lösungen".`,
    pruefkriterien: "Fachlich korrekt, verständlich für die Stufe, nur Beispielzahlen, keine Aussagen zu echten aktuellen Märkten.",
  },
  {
    id: "setups",
    name: "Setup-Lexikon",
    bereich: "1 · Charts lesen",
    kurz: "Pin Bar, Engulfing, Inside Bar, Fakey, Ausbruch, Pullback: Aufbau, Kontext, Fehler und Quiz.",
    liefert: ["Steckbrief des Setups", "Guter vs. schlechter Kontext", "Stop- und Ziel-Logik (allgemein)", "5-Fragen-Quiz"],
    felder: [
      { key: "setup", label: "Welches Setup?", typ: "select", optionen: ["Pin Bar", "Engulfing", "Inside Bar", "Fakey (Fehlausbruch der Inside Bar)", "Ausbruch (Breakout)", "Pullback / Rücklauf", "Doppelboden / Doppeltop", "Retest einer Zone"], pflicht: true },
      { key: "stufe", label: "Dein Stand", typ: "select", optionen: STUFE },
    ],
    auftrag: (b) => `Erstelle einen Lern-Steckbrief zum Setup "${b.setup}" für ${b.stufe || "Anfänger"}.

Liefere in Markdown:
## Steckbrief
Aussehen (mit ASCII-Kerzen-Skizze), was es über Käufer/Verkäufer aussagt, Varianten.
## Wann es Bedeutung hat (Kontext)
Trend, Zone, Zeiteinheit – gute vs. schwache Beispiele (Tabelle).
## Allgemeine Stop- und Ziel-Logik
Wo der Stop typischerweise liegt und warum, wie Ziele allgemein bestimmt werden – mit Beispielzahlen, keine Empfehlung.
## Häufige Fehler
## Erkennen im ZEWI-Indikator
Falls es PB (Pin Bar), E (Engulfing) oder IB (Inside Bar) ist: kurz erwähnen, dass der Gratis-Indikator es markiert.
## Quiz (5 Fragen, A/B/C)
Lösungen am Ende.`,
    pruefkriterien: "Fachlich korrekt, Kontext betont (Muster allein ist kein Grund), keine Signale, Quiz mit eindeutigen Lösungen.",
  },
  {
    id: "chart_trainer",
    name: "Chart-Beschreibungs-Trainer",
    bereich: "1 · Charts lesen",
    kurz: "Du beschreibst einen Chart in Worten – der Trainer zeigt, was Du gesehen und was Du übersehen hast.",
    liefert: ["Deine Analyse bewertet", "Übersehene Punkte", "Lernaufgabe"],
    felder: [
      { key: "beschreibung", label: "Beschreib den Chart (Zeiteinheit, Trend, Zonen, letzte Kerzen)", typ: "textarea", pflicht: true, placeholder: "z. B. H4, seit 3 Wochen höhere Hochs, Rücklauf an alte Zone, letzte Kerze lange Lunte nach unten …" },
      { key: "deine_sicht", label: "Was liest Du daraus?", typ: "textarea" },
    ],
    auftrag: (b) => `Trainiere die Chart-Lesefähigkeit. Der Lernende beschreibt einen Chart:
"${b.beschreibung}"
Seine eigene Lesart: "${b.deine_sicht || "keine angegeben"}"

Liefere in Markdown:
## Was Du richtig erkannt hast
## Was Du prüfen solltest
Fragen, die ein erfahrener Trader an diese Beschreibung stellen würde (Struktur, Zonen, höhere Zeiteinheit, Kontext des Musters).
## Lehrbuch-Einordnung
Welche Konzepte hier eine Rolle spielen – OHNE Aussage, ob gekauft/verkauft werden soll und ohne Prognose.
## Deine Lernaufgabe
Eine konkrete Übung für die nächsten Tage.`,
    pruefkriterien: "Keine Handelsempfehlung und keine Prognose, konstruktiv, bezieht sich nur auf die Beschreibung, gute Rückfragen.",
  },
  // ---------- 2 · HANDEL PLANEN ----------
  {
    id: "handelsplan",
    name: "Handelsplan-Builder",
    bereich: "2 · Handel planen",
    kurz: "Dein schriftlicher Handelsplan: Märkte, Zeiten, Setups, Regeln für Einstieg, Ausstieg und Risiko, Checkliste.",
    liefert: ["Handelsplan zum Ausdrucken", "Checkliste vor jedem Trade", "Stopp-Regeln für schlechte Tage"],
    felder: [
      { key: "maerkte", label: "Welche Märkte?", typ: "select", optionen: MAERKTE },
      { key: "stil", label: "Handelsstil", typ: "select", optionen: ["Swing (Tage)", "Daytrading (Stunden)", "Position (Wochen)"] },
      { key: "zeit", label: "Wann hast Du Zeit zum Handeln?", typ: "text", placeholder: "z. B. werktags 7–9 Uhr und abends 1 Stunde" },
      { key: "setups", label: "Welche Setups willst Du handeln?", typ: "textarea", placeholder: "z. B. Pin Bar an Zone im Trend, Inside-Bar-Ausbruch" },
    ],
    auftrag: (b) => `Erstelle mit dem Trader einen schriftlichen Handelsplan (seine Regeln, nicht deine Empfehlungen).
Märkte: ${b.maerkte || "aus dem Trader-Profil"}
Stil: ${b.stil || "Swing (Tage)"}
Verfügbare Zeit: ${b.zeit || "aus dem Trader-Profil"}
Gewünschte Setups: ${b.setups || "aus dem Trader-Profil"}

Liefere in Markdown:
## Mein Handelsplan (Ich-Form, zum Ausdrucken)
1. Warum ich trade / Ziel (realistisch, ohne Geldversprechen)
2. Märkte & Handelszeiten
3. Meine Setups (je: Bedingungen im Kontext, Einstiegsregel, Stop-Regel, Ausstiegsregel – als Regel formuliert, mit Platzhaltern)
4. Risikoregeln (% pro Trade, Tagesverlust, Wochenverlust, max. Trades) – Werte aus dem Profil oder [Platzhalter]
5. Was ich NICHT tue (News-Zeiten, Nachkaufen von Verlusten …)
6. Tagesablauf (vorher, während, nachher)
## Checkliste vor jedem Trade (Ja/Nein-Fragen)
## Stopp-Regeln für schlechte Tage
Hinweis: Plan regelmäßig im Demokonto prüfen.`,
    pruefkriterien: "Regeln konkret und messbar, Risiko klar begrenzt, Platzhalter statt erfundener Werte, keine Empfehlung bestimmter Trades oder Broker.",
  },
  {
    id: "risiko",
    name: "Risiko- & Positionsgrößen-Coach",
    bereich: "2 · Handel planen",
    kurz: "Risiko pro Trade, Chance-Risiko-Verhältnis, Positionsgröße und Drawdown – verständlich mit Rechenweg.",
    liefert: ["Berechnung mit Rechenweg", "Tabelle verschiedener Szenarien", "Merksätze"],
    felder: [
      { key: "frage", label: "Was willst Du berechnen oder verstehen?", typ: "textarea", pflicht: true, placeholder: "z. B. Konto 10.000 €, 1 % Risiko, Stop 40 Pips EUR/USD – wie viele Lots? Oder: Was bedeutet CRV 1:2?" },
    ],
    auftrag: (b) => `Erkläre und berechne Risiko-Management.
Frage: ${b.frage}

Liefere in Markdown:
## Antwort
Mit vollständigem Rechenweg (Formeln: Risiko in € = Konto × Risiko-%; Positionsgröße = Risiko in € ÷ (Stop-Abstand × Wert pro Punkt/Pip)). Wenn eine Angabe fehlt (z. B. Pip-Wert), als Annahme kennzeichnen und sagen, wo man den echten Wert findet (Kontraktspezifikation des Brokers).
## Szenario-Tabelle
z. B. Risiko 0,5 % / 1 % / 2 % oder CRV 1:1 / 1:2 / 1:3 mit Trefferquote, die zum Break-even nötig ist.
## Drawdown-Realität
Wie viele Verlusttrades in Folge mit diesem Risiko welchen Drawdown erzeugen.
## 3 Merksätze`,
    pruefkriterien: "Rechnungen stimmen (nachrechnen!), Annahmen gekennzeichnet, warnt bei mehr als 2 % Risiko pro Trade, keine Handelsempfehlung.",
  },
  {
    id: "backtest",
    name: "Backtest-Protokoll",
    bereich: "2 · Handel planen",
    kurz: "So testest Du ein Setup sauber – und was Deine Testdaten wirklich aussagen (Trefferquote, Erwartungswert).",
    liefert: ["Backtest-Anleitung", "Vorlage zum Protokollieren", "Auswertung Deiner Daten"],
    felder: [
      { key: "setup", label: "Welches Setup willst Du testen?", typ: "text", pflicht: true },
      { key: "daten", label: "Deine Testergebnisse (optional)", typ: "textarea", placeholder: "z. B. 40 Trades: 17 Gewinner à +2R, 23 Verlierer à -1R" },
    ],
    auftrag: (b) => `Hilf beim Backtesten des Setups "${b.setup}".
Testdaten: ${b.daten || "noch keine"}

Liefere in Markdown:
## Anleitung (Schritt für Schritt)
Regeln vorher festlegen, Zeitraum, Stichprobengröße (warum mind. 50–100 Trades), Fehlerquellen (Rückschaufehler, Rosinenpicken).
## Protokoll-Vorlage
Tabelle mit Spalten zum Ausfüllen.
## Auswertung
Falls Daten vorhanden: Trefferquote, durchschnittliches R, Erwartungswert pro Trade, größte Verlustserie – mit Rechenweg und Einordnung, wie aussagekräftig die Stichprobe ist. Sonst: wie man diese Werte berechnet.
## Nächster Schritt
Hinweis: Vergangene Ergebnisse garantieren keine künftigen.`,
    pruefkriterien: "Statistik korrekt berechnet, Stichprobe kritisch eingeordnet, keine Garantie zukünftiger Ergebnisse.",
  },
  // ---------- 3 · AUSFÜHRUNG ----------
  {
    id: "regelcheck",
    name: "Regel-Check vor dem Einstieg",
    bereich: "3 · Ausführung",
    kurz: "Du beschreibst Dein Setup – der Mentor prüft Punkt für Punkt gegen DEINEN Handelsplan. Kein Signal.",
    liefert: ["Checkliste erfüllt / nicht erfüllt", "Fehlende Punkte", "Risiko-Rechnung"],
    felder: [
      { key: "setup", label: "Beschreib die Situation nach Deinen Regeln", typ: "textarea", pflicht: true, placeholder: "z. B. H4 Aufwärtstrend, Rücklauf an Zone, Pin Bar mit langer Lunte, Stop unter Lunte 35 Pips, Ziel letztes Hoch 80 Pips" },
      { key: "gefuehl", label: "Wie fühlst Du Dich gerade?", typ: "select", optionen: ["ruhig", "ungeduldig", "nach Verlust", "nach Gewinn euphorisch", "müde"] },
    ],
    auftrag: (b) => `Prüfe die beschriebene Situation AUSSCHLIESSLICH gegen den Handelsplan und die Risikoregeln aus dem Trader-Profil.
Situation: ${b.setup}
Gefühlslage: ${b.gefuehl || "ruhig"}

Liefere in Markdown:
## Regel-Check
Tabelle: Regel aus dem Plan | erfüllt? (ja / nein / unklar) | Begründung. Wenn kein Plan im Profil steht: darauf hinweisen und auf den Handelsplan-Builder verweisen.
## Risiko
CRV und Risiko in % aus den genannten Werten berechnen (Rechenweg).
## Psychologie-Check
Passt die Gefühlslage zu den Pausenregeln?
## Ergebnis
NUR: "Deine Regeln sind erfüllt / nicht erfüllt / unklar". KEINE Aussage, ob gehandelt werden soll, keine Prognose. Die Entscheidung trifft der Trader selbst.`,
    pruefkriterien: "Keinerlei Kauf-/Verkaufsempfehlung oder Prognose, nur Abgleich mit den Regeln aus dem Profil, Rechnung korrekt.",
  },
  {
    id: "tagebuch",
    name: "Trading-Tagebuch-Auswertung",
    bereich: "3 · Ausführung",
    kurz: "Regelbrüche, Overtrading, Revenge-Trading und Muster in Deinen Trades – mit 3 Regeln für nächste Woche.",
    liefert: ["Zusammenfassung mit Zahlen", "Regelbrüche", "Verhaltensmuster", "3 Regeln für nächste Woche"],
    felder: [
      { key: "trades", label: "Deine Trades (Datum, Markt, Richtung, Ergebnis, Grund/Gefühl)", typ: "textarea", pflicht: true },
    ],
    auftrag: (b) => `Werte dieses Trading-Tagebuch aus – gemessen an den Regeln im Trader-Profil.
TRADES:
${b.trades}

Liefere in Markdown:
## Zusammenfassung (Anzahl, Gewinner/Verlierer, Summe, Trefferquote – Rechenweg)
## Regelbrüche (konkret mit Datum)
## Verhaltensmuster (Revenge-Trading, Overtrading, Zeiten, Gefühle)
## Was gut lief
## 3 Regeln für nächste Woche (messbar)`,
    pruefkriterien: "Zahlen stimmen, nur Disziplin und Regeln bewertet, keine Bewertung ob Trades 'richtig' waren, keine Signale.",
  },
  {
    id: "challenge",
    name: "Prop-Firm-Challenge-Coach",
    bereich: "3 · Ausführung",
    kurz: "Tagesverlust und Drawdown durchrechnen, Risiko pro Trade ableiten, Plan zum Bestehen der Challenge.",
    liefert: ["Regeln in Zahlen", "Maximales Risiko pro Trade", "Wochenplan", "Notfall-Regeln"],
    felder: [
      { key: "regeln", label: "Regeln Deiner Challenge (aus den aktuellen Bedingungen des Anbieters)", typ: "textarea", pflicht: true, placeholder: "z. B. Konto 100.000 $, Gewinnziel 10 %, max. Tagesverlust 5 %, max. Gesamtverlust 10 %, Mindesthandelstage 4" },
      { key: "stand", label: "Aktueller Stand (optional)", typ: "text", placeholder: "z. B. Tag 6, +3,2 %, heute -1,1 %" },
    ],
    auftrag: (b) => `Coache für eine Prop-Firm-Challenge. Nutze NUR die vom Trader angegebenen Regeln (keine Anbieter-Werte aus dem Gedächtnis).
Regeln: ${b.regeln}
Stand: ${b.stand || "Start"}

Liefere in Markdown:
## Die Regeln in Zahlen
Tabelle: Regel | in % | in Geld.
## Puffer-Rechnung
Wie viel Verlust heute und insgesamt noch möglich ist (Rechenweg), mit eigenem Sicherheits-Puffer.
## Risiko pro Trade
Welches Risiko pro Trade die Regeln selbst bei 5 Verlusten in Folge einhält – mit Tabelle.
## Plan
Tempo zum Gewinnziel ohne Hast, Verhalten nach Gewinn- und Verlusttagen.
## Notfall-Regeln
Wann sofort Schluss für den Tag ist.
Hinweis: Viele Challenges werden nicht bestanden; das Gebühren-Risiko bewusst eingehen.`,
    pruefkriterien: "Rechnungen korrekt, nur angegebene Regeln verwendet, konservativ, keine Signale, ehrlicher Risikohinweis.",
  },
  // ---------- MENTALTRAINING & FUNDAMENTALES ----------
  {
    id: "psychologie",
    name: "Psychologie-Coach",
    bereich: "Mentaltraining",
    kurz: "FOMO, Angst, Gier, Tilt und Disziplin – konkrete Übungen und Pausenregeln.",
    liefert: ["Was hinter dem Gefühl steckt", "Sofort-Übung", "Routine für 7 Tage", "Pausenregeln"],
    felder: [
      { key: "thema", label: "Was beschäftigt Dich?", typ: "select", optionen: ["FOMO – Angst, etwas zu verpassen", "Angst abzudrücken", "Gewinne zu früh mitnehmen", "Verluste laufen lassen", "Revenge-Trading", "Overtrading", "Nach Verlustserie demotiviert", "Euphorie nach Gewinnen"], pflicht: true },
      { key: "situation", label: "Beschreib eine typische Situation", typ: "textarea" },
    ],
    auftrag: (b) => `Coache den Trader mental zum Thema "${b.thema}".
Situation: ${b.situation || "keine Details"}

Liefere in Markdown:
## Was dahintersteckt (kurz, ohne Psycho-Fachchinesisch)
## Sofort-Übung (2 Minuten)
## Routine für 7 Tage (vor, während, nach dem Handel)
## Pausenregeln (konkret, z. B. nach 2 Verlusten Plattform schließen)
## Wann Du Hilfe holen solltest
Anzeichen für problematisches Spielverhalten und Hinweis auf Spielsuchthilfe Österreich. Kein Ersatz für Therapie.`,
    pruefkriterien: "Einfühlsam, praktisch, keine Heilversprechen, Hinweis auf Hilfe bei Suchtanzeichen vorhanden.",
  },
  {
    id: "fundamental",
    name: "Wirtschaftskalender-Erklärer",
    bereich: "Mentaltraining",
    kurz: "Was Zinsentscheid, Inflationsdaten oder Arbeitsmarktbericht bedeuten – und warum der Markt dann schwankt.",
    liefert: ["Erklärung des Termins", "Warum es Volatilität gibt", "Wie Trader damit umgehen (allgemein)"],
    felder: [
      { key: "termin", label: "Welcher Termin / welches Thema?", typ: "text", pflicht: true, placeholder: "z. B. EZB-Zinsentscheid, US-Arbeitsmarktbericht, Inflationsdaten" },
    ],
    auftrag: (b) => `Erkläre den Wirtschaftstermin "${b.termin}" für Trader-Einsteiger.

Liefere in Markdown:
## Was ist das? (einfach erklärt)
## Wer veröffentlicht es, wie oft? (allgemein; aktuelle Termine im Wirtschaftskalender nachsehen)
## Warum der Markt reagiert
Erwartung vs. tatsächlicher Wert, Zinsen und Währungen – mit erfundenem Beispiel.
## Was Trader allgemein beachten
Spreads, Schwankungen, Regeln im eigenen Plan (z. B. vor Termin nicht neu einsteigen) – ohne Empfehlung zu einem konkreten Markt.
## Merksatz`,
    pruefkriterien: "Korrekt und einfach, keine Prognose zum aktuellen Termin, keine erfundenen aktuellen Daten.",
  },
  // ---------- LERNEN ----------
  {
    id: "lernpfad",
    name: "Lernpfad-Mentor",
    bereich: "Lernen",
    kurz: "Dein persönlicher Lehrplan für 30, 60 oder 90 Tage – mit Wochenzielen und welcher Mentor wann hilft.",
    liefert: ["Lehrplan Woche für Woche", "Wochenziele", "Passende Mentoren je Woche"],
    felder: [
      { key: "dauer", label: "Zeitraum", typ: "select", optionen: ["30 Tage", "60 Tage", "90 Tage"] },
      { key: "zeit", label: "Zeit pro Woche", typ: "select", optionen: ["2–3 Stunden", "5 Stunden", "10+ Stunden"] },
      { key: "ziel", label: "Dein Lernziel", typ: "text", placeholder: "z. B. eigenen Handelsplan im Demokonto 50 Trades lang einhalten" },
    ],
    auftrag: (b) => `Erstelle einen persönlichen Lehrplan.
Zeitraum: ${b.dauer || "30 Tage"}, Zeit pro Woche: ${b.zeit || "5 Stunden"}
Ziel: ${b.ziel || "aus dem Trader-Profil ableiten"}

Aufbau der Akademie: 1 · Charts lesen (Marktstruktur-Coach, Setup-Lexikon, Chart-Trainer) → 2 · Handel planen (Handelsplan-Builder, Risiko-Coach, Backtest-Protokoll) → 3 · Ausführung (Regel-Check, Tagebuch, Challenge-Coach) + Mentaltraining (Psychologie-Coach, Wirtschaftskalender) + Prüfung.

Liefere in Markdown:
## Dein Lehrplan
Tabelle: Woche | Thema | Aufgaben | Mentor | Wochenziel (messbar).
## Regeln für den Lernweg
z. B. erst Demokonto, dann kleines Echtgeldkonto nur nach X Wochen Regel-Treue.
## Lernstand messen`,
    pruefkriterien: "Realistisch für die angegebene Zeit, logischer Aufbau, Demo vor Echtgeld, messbare Wochenziele.",
  },
  {
    id: "pruefung",
    name: "Prüfung & Wochenquiz",
    bereich: "Lernen",
    kurz: "10 Prüfungsfragen zu einem Modul – mit Auflösung, Punktezahl und was Du wiederholen solltest.",
    liefert: ["10 Fragen (A/B/C/D)", "Lösungsschlüssel mit Erklärung", "Bewertungsschema"],
    felder: [
      { key: "modul", label: "Modul", typ: "select", optionen: ["1 · Charts lesen", "2 · Handel planen", "3 · Ausführung", "Mentaltraining", "Gesamtprüfung"], pflicht: true },
      { key: "stufe", label: "Schwierigkeit", typ: "select", optionen: STUFE },
    ],
    auftrag: (b) => `Erstelle eine Prüfung zum Modul "${b.modul}" (Schwierigkeit: ${b.stufe || "Anfänger"}).

Liefere in Markdown:
## Prüfung (10 Fragen)
Je Frage 4 Antworten A–D, gemischt aus Wissen, Rechnen (mit Beispielzahlen) und Situationen.
## Lösungsschlüssel
Richtige Antwort + 1–2 Sätze Erklärung.
## Bewertung
9–10 sehr gut, 7–8 gut, unter 7: welche Themen wiederholen und mit welchem Mentor.`,
    pruefkriterien: "Je Frage genau eine eindeutig richtige Antwort, Rechenfragen korrekt, keine Fragen zu aktuellen Kursen.",
  },
  // ---------- MARKETING für ZEWI Capital ----------
  {
    id: "lerncontent",
    name: "Lern-Content für Social Media",
    bereich: "Marketing",
    kurz: "Lern-Reels, Karussells und Posts über Trading-Wissen – mit Risikohinweis, ohne Gewinnversprechen.",
    liefert: ["Reel-Skript 30 s", "Karussell 6 Folien", "Caption mit Risikohinweis"],
    felder: [
      { key: "thema", label: "Lern-Thema", typ: "text", pflicht: true, placeholder: "z. B. Was ist eine Pin Bar? / Warum 1 % Risiko?" },
      { key: "plattform", label: "Plattform", typ: "select", optionen: ["Instagram", "TikTok", "YouTube Shorts", "LinkedIn"] },
    ],
    auftrag: (b) => `Erstelle Lern-Content zum Thema "${b.thema}" für ${b.plattform || "Instagram"}.

Liefere in Markdown:
## 5 Hooks (ohne Geld- oder Erfolgsversprechen)
## Reel-Skript 30 s (Zeit | Gesprochen | Text auf dem Bild | Bild)
## Karussell (6 Folien)
## Caption (max. 80 Wörter) mit Risikohinweis am Ende: "Lerninhalt, keine Anlageberatung. Trading mit Hebelprodukten birgt hohe Verlustrisiken."
## 5 Hashtags
Falls passend: Hinweis auf den Gratis-Indikator als Lernhilfe.`,
    pruefkriterien: "Keine Gewinnversprechen, keine Lifestyle-Protzerei, keine Signale, Risikohinweis vorhanden, fachlich korrekt.",
  },
  {
    id: "lead_mails",
    name: "Mail-Serie für Interessenten",
    bereich: "Marketing",
    kurz: "Willkommens-Serie für Leute, die sich den Indikator geholt haben – Wissen zuerst, dann Akademie.",
    liefert: ["5 Mails mit Betreff", "Versandplan", "Pflicht-Hinweise"],
    felder: [
      { key: "magnet", label: "Worüber haben sie sich eingetragen?", typ: "text", placeholder: "z. B. Gratis Price-Action-Indikator" },
      { key: "angebot", label: "Was soll am Ende angeboten werden?", typ: "text", placeholder: "z. B. ZEWI Capital Akademie Pro" },
    ],
    auftrag: (b) => `Schreibe eine 5-teilige Willkommens-Mail-Serie.
Eingetragen über: ${b.magnet || "Gratis Price-Action-Indikator"}
Ziel-Angebot: ${b.angebot || "ZEWI Capital Akademie"}

Liefere in Markdown je Mail: Tag (0/2/4/6/8), Betreff (max. 45 Zeichen), Vorschautext, Text (150–250 Wörter), ein Aufruf.
Aufbau: 1 Willkommen + Download, 2 Geschichte/Warum, 3 Lern-Inhalt (Aha-Moment), 4 häufigster Fehler + Lösung, 5 Einladung zur Akademie.
Jede Mail: Risikohinweis im Fuß, Abmeldelink-Platzhalter, keine Gewinnversprechen. Partnerlinks nur als "Werbung" gekennzeichnet.`,
    pruefkriterien: "Ein Aufruf pro Mail, Risikohinweis und Abmeldelink vorhanden, keine Gewinnversprechen, Werbung gekennzeichnet.",
  },
];
