import { Legal, T } from "@/components/Legal";

export default function Impressum() {
  return (
    <Legal titel="Impressum">
      <p>Informationen gemäß § 5 ECG, § 14 UGB und Offenlegung gemäß § 25 MedienG</p>
      <p><b>Alois Wimmer</b> – ZEWI<br /><T>[Straße Hausnummer]</T><br />4563 Micheldorf in Oberösterreich, Österreich</p>
      <p>E-Mail: info@zewi.ai<br />Telefon: <T>[Telefonnummer]</T></p>
      <p>Unternehmensgegenstand: <T>[z. B. Werbeagentur / Dienstleistungen in der automatischen Datenverarbeitung]</T><br />
        UID-Nummer: <T>[ATU…]</T><br />
        Gewerbebehörde: <T>[Bezirkshauptmannschaft Kirchdorf an der Krems]</T><br />
        Mitglied der Wirtschaftskammer Oberösterreich, <T>[Fachgruppe]</T><br />
        Berufsrecht: Gewerbeordnung, abrufbar unter www.ris.bka.gv.at</p>
      <p>Verbraucher können Beschwerden an die Online-Streitbeilegungsplattform der EU richten bzw. an <T>[prüfen, ob noch erforderlich]</T>.</p>
    </Legal>
  );
}
