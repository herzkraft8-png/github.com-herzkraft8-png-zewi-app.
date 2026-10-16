import { aktuellerNutzer } from "@/lib/supabase";
import { aktivePlan, kontingent, kontoLaden } from "@/lib/konto";
import { PLAENE } from "@/lib/plaene";

export default async function Abo({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const user = (await aktuellerNutzer())!;
  const konto = await kontoLaden(user.id);
  const plan = aktivePlan(konto);
  const k = kontingent(konto, user.email);
  return (
    <>
      <header>
        <span className="eyebrow">Abo</span>
        <h1>{PLAENE[plan].name}</h1>
        <p className="muted">{k.genutzt} von {k.limit} Aufträgen in diesem Monat genutzt. Der Zähler startet am 1. jedes Monats neu.</p>
      </header>
      {ok && <p className="notice" role="status">Danke! Sobald die Zahlung bestätigt ist, ist ZEWI Pro aktiv (meist in wenigen Sekunden – Seite neu laden).</p>}
      {konto.abo_status === "past_due" && <p className="notice err">Die letzte Zahlung ist fehlgeschlagen. Bitte Zahlungsmethode aktualisieren.</p>}
      <div className="preise">
        {(["free", "pro"] as const).map((id) => (
          <article key={id} className={`card preis ${id === plan ? "hl" : ""}`}>
            <h3>{PLAENE[id].name}{id === plan ? " · aktuell" : ""}</h3>
            <div className="betrag">{PLAENE[id].preis}</div>
            <ul>{PLAENE[id].punkte.map((x) => <li key={x}>{x}</li>)}</ul>
            {id === "pro" && plan !== "pro" && (
              <form action="/api/stripe/checkout" method="post"><button className="btn primary" type="submit">Jetzt auf ZEWI Pro upgraden</button></form>
            )}
            {id === "pro" && konto.stripe_customer_id && (
              <form action="/api/stripe/portal" method="post"><button className="btn" type="submit">Zahlung & Kündigung verwalten</button></form>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
