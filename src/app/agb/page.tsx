import { Legal, T } from "@/components/Legal";
import { TEXTE } from "@/lib/produkt";

export default function Agb() {
  return (
    <Legal titel="Allgemeine Geschäftsbedingungen">
      <h3>1. Leistung</h3>
      <p>ZEWI stellt eine Software bereit, mit der KI-Agenten Marketing-Texte und Konzepte erstellen. Ergebnisse sind Entwürfe. Der Kunde prüft sie vor jeder Veröffentlichung und ist für deren Verwendung verantwortlich. ZEWI veröffentlicht nichts automatisch.</p>
      <h3>2. Tarife</h3>
      <p>„Start“ ist kostenlos mit begrenzter Anzahl an Aufträgen. „ZEWI Pro“ kostet <T>[99 € brutto/netto]</T> pro Monat, ist monatlich kündbar und verlängert sich automatisch, bis gekündigt wird. Nicht genutzte Aufträge verfallen am Monatsende.</p>
      <h3>3. Zielgruppe</h3>
      <p><T>[Nur Unternehmer (B2B) oder auch Verbraucher? Bei Verbrauchern: Rücktrittsrecht nach FAGG regeln.]</T></p>
      <h3>4. KI-Inhalte</h3>
      <p>KI kann Fehler machen. ZEWI übernimmt keine Gewähr für Richtigkeit, Rechtskonformität oder Erfolg der Inhalte. Rechtlich relevante Inhalte (Gesundheit, Finanzen, Recht) sind vor Verwendung fachlich zu prüfen.</p>
      {TEXTE.risiko && (<><h3>4a. Keine Anlageberatung</h3><p>{TEXTE.risiko} Inhalte dienen ausschließlich der Ausbildung. Entscheidungen über Geldanlagen trifft der Nutzer selbst und auf eigenes Risiko.</p></>)}
      <h3>5. Haftung</h3>
      <p><T>[Haftungsbeschränkung juristisch formulieren lassen]</T></p>
      <h3>6. Recht & Gerichtsstand</h3>
      <p>Österreichisches Recht. Gerichtsstand <T>[Kirchdorf an der Krems / Steyr]</T>, soweit gesetzlich zulässig.</p>
    </Legal>
  );
}
