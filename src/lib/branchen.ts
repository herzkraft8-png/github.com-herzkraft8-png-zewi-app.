/**
 * Branchen-Regeln, die automatisch greifen, wenn das Kundenprofil passt.
 * Gesundheit/Energetik: Werbung in Österreich ist streng geregelt (u. a. Abgrenzung zu Ärzten,
 * Psychotherapie und Gesundheitsberufen; WKO-Richtlinien für Humanenergetiker).
 * Inhaltlich vorsichtig formuliert – der Betrieb soll seine Texte zusätzlich von der WKO prüfen lassen.
 */

const GESUNDHEIT = /cranio|kranio|sakral|energeti|massage|heil|therap|kinesiolog|shiatsu|reiki|yoga|achtsam|meditat|hypno|coach|physio|osteo|kosmetik|beauty|wellness|ernährung|lebensberat|mental|aroma|klangschale|pilates|fußreflex|lymph/i;

export function istGesundheit(p: { branche?: string; angebot?: string; firma?: string }) {
  return GESUNDHEIT.test(`${p.branche ?? ""} ${p.angebot ?? ""} ${p.firma ?? ""}`);
}

export const GESUNDHEIT_REGELN = `GESUNDHEITS- & ENERGETIK-WERBUNG (Österreich) – zwingend einhalten:
- KEINE Heilversprechen, keine Aussagen über Heilung, Linderung oder Behandlung von Krankheiten oder Beschwerden ("hilft bei Migräne", "löst Blockaden im Rücken", "heilt Traumata" sind verboten).
- KEINE Krankheitsnamen und Diagnosen in der Werbung. Keine Aussage, dass eine Methode Medizin oder Psychotherapie ersetzt.
- Wortwahl bei Energetik/Wellness: "Sitzung", "Anwendung", "Begleitung", "Klientin/Klient" – NICHT "Therapie", "Behandlung", "Patient", "Diagnose" (außer der Betrieb ist nachweislich Arzt, Physiotherapeut oder anderer Gesundheitsberuf – dann Platzhalter [Berufsbezeichnung prüfen]).
- Erlaubt: Wohlbefinden, Entspannung, Ruhe, Zeit für sich, achtsame Berührung, Ausgleich, Unterstützung der Selbstwahrnehmung.
- Keine Kundenstimmen mit gesundheitlichen Erfolgsberichten. Keine Vorher/Nachher-Aussagen zu Gesundheit.
- Bei Angeboten für Babys, Kinder, Schwangere: besonders zurückhaltend, Hinweis auf ärztliche Abklärung.
- Pflicht-Hinweis bei Texten über die Methode: "Die Anwendung ersetzt keine ärztliche Diagnose oder Behandlung." (sinngemäß, passend in den Text eingebaut)
- Datenschutz: Gesundheitsdaten sind besonders geschützt – in Texten nie bestätigen, wer Klientin ist.`;

const FENSTER = /fenster|türen|tueren|haustür|wintergarten|sonnenschutz|rollladen|rolläden|jalousie|raffstore|insektenschutz|glaser|verglasung/i;

export function istFenster(p: { branche?: string; angebot?: string; firma?: string }) {
  return FENSTER.test(`${p.branche ?? ""} ${p.angebot ?? ""} ${p.firma ?? ""}`);
}

export const FENSTER_REGELN = `FENSTER-, TÜREN- & SONNENSCHUTZ-BRANCHE – zwingend:
- KEINE erfundenen Einsparversprechen ("spart 30 % Heizkosten"). Einsparungen nur allgemein ("kann den Wärmeverlust deutlich verringern") oder mit Platzhalter [Einsparung lt. Energieausweis/Berechnung].
- Technische Werte (U-Wert Uw/Ug, Schallschutz dB, Sicherheitsklasse RC2) nur aus den Angaben des Betriebs, sonst Platzhalter. Fachbegriffe immer in Alltagssprache übersetzen ("U-Wert = wie viel Wärme durchs Fenster verloren geht – je kleiner, desto besser").
- Förderungen (z. B. Sanierungsbonus von Bund/Land): NIE Beträge, Prozentsätze oder Fristen erfinden – immer "[aktuelle Förderung prüfen: Stand, Höhe, Frist]" und Hinweis, dass sich Förderungen ändern.
- Montage: Qualitätsmerkmale (fachgerechte, luftdichte Montage, Anschlussfugen) nur behaupten, wenn im Profil angegeben.
- Preise nur aus den Angaben, sonst "[Preis ab]".
- Typische Kundenängste ernst nehmen: Dreck und Lärm beim Tausch, Dauer, Schimmel/Lüften danach, Kosten.`;
