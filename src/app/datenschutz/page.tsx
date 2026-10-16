import { Legal, T } from "@/components/Legal";

export default function Datenschutz() {
  return (
    <Legal titel="Datenschutzerklärung">
      <h3>Verantwortlicher</h3>
      <p>Alois Wimmer – ZEWI, <T>[Adresse]</T>, info@zewi.ai</p>
      <h3>Welche Daten wir verarbeiten</h3>
      <ul>
        <li>Kontodaten: E-Mail-Adresse, Passwort (verschlüsselt gespeichert) – zur Bereitstellung des Kontos (Art. 6 Abs. 1 lit. b DSGVO).</li>
        <li>Markenprofil und Aufträge: Angaben zu Deinem Betrieb, Briefings und Ergebnisse – zur Erbringung der Leistung.</li>
        <li>Zahlungsdaten: werden direkt von Stripe verarbeitet; wir erhalten keine vollständigen Kartendaten.</li>
        <li>Technische Daten: Server-Logs (IP-Adresse, Zeitpunkt) zur Sicherheit (Art. 6 Abs. 1 lit. f DSGVO).</li>
      </ul>
      <h3>Auftragsverarbeiter</h3>
      <ul>
        <li>Supabase (Datenbank & Login), Serverstandort <T>[EU-Region, z. B. Frankfurt]</T></li>
        <li>Vercel (Hosting) – <T>[Region und Vertrag prüfen]</T></li>
        <li>Stripe (Zahlungen)</li>
        <li>Anthropic (KI-Verarbeitung der Briefings, USA – Datenübermittlung auf Grundlage <T>[EU-US Data Privacy Framework / Standardvertragsklauseln prüfen]</T>). Bitte keine Gesundheitsdaten oder Daten Dritter in Briefings eingeben.</li>
      </ul>
      <p>Schriften werden lokal ausgeliefert; es werden keine Daten an Google Fonts übertragen. Es werden nur technisch notwendige Cookies (Anmeldung) verwendet.</p>
      <h3>Speicherdauer</h3>
      <p>Solange Dein Konto besteht. Aufträge kannst Du jederzeit selbst löschen. Rechnungsdaten bewahren wir 7 Jahre auf (§ 132 BAO).</p>
      <h3>Deine Rechte</h3>
      <p>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch. Beschwerde bei der Österreichischen Datenschutzbehörde (www.dsb.gv.at).</p>
    </Legal>
  );
}
