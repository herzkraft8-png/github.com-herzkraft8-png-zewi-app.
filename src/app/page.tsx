import Link from "next/link";
import { AGENTEN } from "@/lib/agenten";
import { PLAENE } from "@/lib/plaene";
import { Footer, PublicNav } from "@/components/Public";
import { IST_CAPITAL, TEXTE } from "@/lib/produkt";

const AGENTUR_ABLAUF = [
  ["Idee", "In eigenen Worten – der Content Planner wählt den Agenten"],
  ["KI-Zwilling", "Deine Sprache, Dein Angebot, Deine Region"],
  ["Agent arbeitet", "Der passende Fach-Agent erstellt alles"],
  ["Qualitätsprüfung", "Mindestens 9 von 10 Punkten, sonst Überarbeitung"],
  ["Du gibst frei", "Ändern lassen oder freigeben"],
  ["Download", "Fertiges Paket kopieren oder herunterladen"],
  ["Lernen", "Deine Bewertungen machen jeden Auftrag besser"],
];

const AGENTUR_EXTRAS = [
  ["Content Planner", "Schreib „Ich hätte gern ein Reel über unseren Herbst-Check“ – die ZEWI-Zentrale wählt den Agenten und füllt das Briefing vor."],
  ["Learning Agent", "Gut oder passt nicht? Jede Rückmeldung wird zur Regel, die alle Agenten und die Qualitätsprüfung beachten."],
  ["Agenturmodus", "Mehrere Kundenprofile in einem Konto. Ideal für Agenturen, Franchise und Betriebe mit mehreren Standorten."],
  ["ZEWI-Board", "Jeder Agent arbeitet nach den Prinzipien erfolgreicher Unternehmer – von Angebots-Gestaltung bis Aufmerksamkeit. Und die Board-Beratung macht daraus Deinen 30-Tage-Plan."],
];

const CAPITAL_ABLAUF = [
  ["Trader-Profil", "Erfahrung, Märkte, Plan und Risikoregeln"],
  ["Charts lesen", "Marktstruktur und Setups verstehen"],
  ["Handel planen", "Eigener Plan, Risiko, Backtest"],
  ["Ausführung", "Regel-Check, Tagebuch, Challenge"],
  ["Psyche", "Disziplin, FOMO, Pausenregeln"],
  ["Prüfung", "Wochenquiz und Abschlussprüfung"],
];
const CAPITAL_EXTRAS = [
  ["Lernen statt Signale", "Kein Mentor sagt Dir, was Du kaufen sollst. Alle prüfen Dich gegen Deine eigenen Regeln – so wirst Du selbstständig."],
  ["Persönlicher Lehrplan", "30, 60 oder 90 Tage, abgestimmt auf Deine Zeit und Dein Ziel. Demo zuerst, Echtgeld erst mit Regel-Treue."],
  ["Learning Agent", "Er merkt sich Deine Schwächen aus Tagebuch und Rückmeldungen und trainiert genau dort."],
  ["Gratis Price-Action-Indikator", "Markiert Pin Bars, Engulfing, Inside Bars und Swings in TradingView – als Lernhilfe."],
];
const ABLAUF = IST_CAPITAL ? CAPITAL_ABLAUF : AGENTUR_ABLAUF;
const EXTRAS = IST_CAPITAL ? CAPITAL_EXTRAS : AGENTUR_EXTRAS;

export default function Start() {
  return (
    <>
      <PublicNav />
      <main>
        <section className="wrap hero">
          <span className="pill">{TEXTE.pill}</span>
          <h1>
            {TEXTE.heroA} <span className="gold">{TEXTE.heroB}</span>
          </h1>
          <p className="lead">{TEXTE.lead}</p>
          <div className="cta-row">
            <Link href="/registrieren" className="btn primary">Kostenlos starten →</Link>
            <a href="#ablauf" className="btn">So funktioniert's</a>
          </div>
          <p className="muted" style={{ fontSize: 14 }}>{IST_CAPITAL ? "5 Lerneinheiten gratis · keine Kreditkarte nötig · Lernplattform, keine Anlageberatung" : "5 Aufträge gratis · keine Kreditkarte nötig · in 5 Minuten startklar"}</p>
        </section>

        <section id="agenten" className="wrap section">
          <header>
            <span className="eyebrow">{IST_CAPITAL ? "Die Mentoren" : "Das Team"}</span>
            <h2>{AGENTEN.length} {IST_CAPITAL ? "KI-Mentoren. Ein Trader-Profil." : "Fach-Agenten. Ein Markenprofil."}</h2>
            <p className="muted">{IST_CAPITAL ? "Jeder Mentor kennt Deine Erfahrung, Deinen Plan und Deine Regeln. Lernhilfe, keine Anlageberatung." : "Jeder Agent kennt Deinen Betrieb, Deine Region und Deinen Ton – und schreibt nichts dazu, was nicht stimmt."}</p>
          </header>
          <div className="grid3">
            {AGENTEN.map((a) => (
              <article key={a.id} className="card agent-card">
                <span className="tag">{a.bereich}</span>
                <h3>{a.name}</h3>
                <p className="muted">{a.kurz}</p>
                <ul>{a.liefert.map((l) => <li key={l}>{l}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap section">
          <header>
            <span className="eyebrow">Was ZEWI anders macht</span>
            <h2>{IST_CAPITAL ? "Eine Akademie, die Dich selbstständig macht." : "Ein Team, das mitdenkt und dazulernt."}</h2>
          </header>
          <div className="grid3">
            {EXTRAS.map(([t, s]) => (
              <article key={t} className="card agent-card"><h3>{t}</h3><p className="muted">{s}</p></article>
            ))}
          </div>
        </section>

        <section id="ablauf" className="wrap section">
          <header>
            <span className="eyebrow">{IST_CAPITAL ? "Der Lernweg" : "Der ZEWI-Prozess"}</span>
            <h2>{IST_CAPITAL ? "Vom ersten Chart zum eigenen Handelsplan." : "Vom Briefing zum fertigen Paket."}</h2>
            <p className="muted">{IST_CAPITAL ? "In der Reihenfolge, in der Trading-Ausbildungen aufgebaut sind: Charts lesen, planen, ausführen." : "Keine automatische Veröffentlichung. Du behältst die Kontrolle über jede Zeile."}</p>
          </header>
          <ol className="prozess">
            {ABLAUF.map(([t, s]) => (
              <li key={t}><b>{t}</b><span>{s}</span></li>
            ))}
          </ol>
        </section>

        <section id="preise" className="wrap section">
          <header>
            <span className="eyebrow">Preise</span>
            <h2>Einfach starten. Monatlich kündbar.</h2>
          </header>
          <div className="preise">
            {(["free", "pro"] as const).map((id) => {
              const p = PLAENE[id];
              return (
                <article key={id} className={`card preis ${id === "pro" ? "hl" : ""}`}>
                  <h3>{p.name}</h3>
                  <div className="betrag">{p.preis}</div>
                  <ul>{p.punkte.map((x) => <li key={x}>{x}</li>)}</ul>
                  <Link href="/registrieren" className={`btn ${id === "pro" ? "primary" : ""}`}>
                    {id === "pro" ? "Mit Start beginnen, dann upgraden" : "Kostenlos starten"}
                  </Link>
                </article>
              );
            })}
          </div>
          <p className="muted" style={{ fontSize: 14 }}>Preise inkl. aller {IST_CAPITAL ? "Mentoren" : "Agenten"}. Umsatzsteuer: <span className="todo">[brutto/netto festlegen]</span></p>
        </section>
      </main>
      <Footer />
    </>
  );
}
