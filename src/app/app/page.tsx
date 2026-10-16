import Link from "next/link";
import { aktuellerNutzer, supabaseServer } from "@/lib/supabase";
import { kontingent, kontoLaden } from "@/lib/konto";
import { aktiveMarke, zwillingProzent } from "@/lib/marken";
import { agentById } from "@/lib/agenten";
import { StatusChip } from "@/components/StatusChip";
import { IST_CAPITAL, TEXTE } from "@/lib/produkt";

function gruss() {
  const h = Number(new Intl.DateTimeFormat("de-AT", { hour: "numeric", hour12: false, timeZone: "Europe/Vienna" }).format(new Date()));
  return h < 11 ? "Guten Morgen" : h < 18 ? "Servus" : "Guten Abend";
}

export default async function Dashboard() {
  const user = (await aktuellerNutzer())!;
  const sb = await supabaseServer();
  const [{ aktiv }, konto] = await Promise.all([aktiveMarke(user.id), kontoLaden(user.id)]);
  const [{ data: jobs }, { count: lern }] = await Promise.all([
    sb.from("jobs").select("id, agent, titel, status, created_at").eq("marke_id", aktiv.id).order("created_at", { ascending: false }).limit(8),
    sb.from("lernnotizen").select("id", { count: "exact", head: true }).eq("marke_id", aktiv.id),
  ]);
  const k = kontingent(konto, user.email);
  const zw = zwillingProzent(aktiv);
  const offen = (jobs ?? []).filter((j) => j.status === "zur_freigabe");
  const freigegeben = (jobs ?? []).filter((j) => j.status === "freigegeben").slice(0, 4);
  return (
    <>
      <header>
        <span className="eyebrow">Steuerzentrale · {aktiv.name}</span>
        <h1>{gruss()}{aktiv.firma ? `, ${aktiv.firma}` : ""}.</h1>
        <p className="muted">{IST_CAPITAL ? "Stell Deine Frage, ZEWI wählt den passenden Mentor. Lernhilfe, keine Anlageberatung." : "Beschreib eine Idee, ZEWI wählt den passenden Agenten und legt das Ergebnis zur Freigabe ab."}</p>
      </header>
      <div className="row"><Link href="/app/planer" className="btn primary">{IST_CAPITAL ? "Zum Lern-Planer →" : "Zum Content Planner →"}</Link><Link href="/app/studio" className="btn">{IST_CAPITAL ? "Alle Mentoren" : "Alle Agenten"}</Link></div>
      <div className="kpis">
        <Link href="/app/marke" className="card" style={{ textDecoration: "none" }}><span className="muted">{TEXTE.profilName}</span><b>{zw} %</b><div className="bar" aria-hidden="true"><i style={{ width: `${zw}%` }} /></div></Link>
        <Link href="/app/auftraege?status=zur_freigabe" className="card" style={{ textDecoration: "none" }}><span className="muted">Warten auf Freigabe</span><b>{offen.length}</b></Link>
        <Link href="/app/lernen" className="card" style={{ textDecoration: "none" }}><span className="muted">Lernnotizen</span><b>{lern ?? 0}</b></Link>
        <Link href="/app/abo" className="card" style={{ textDecoration: "none" }}><span className="muted">Aufträge frei</span><b>{k.limit > 9000 ? "∞" : k.frei}</b></Link>
      </div>
      <section className="card" style={{ display: "grid", gap: 12 }}>
        <h3>Deine nächsten Schritte</h3>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          {zw < 80 && <li><Link href="/app/marke">{TEXTE.profilName} vervollständigen</Link> ({zw} %): {IST_CAPITAL ? "Handelsplan, Risikoregeln und Lernziele machen die Mentoren deutlich treffsicherer." : "Angebot, Zielgruppe und Ton machen die Ergebnisse deutlich besser."}</li>}
          {offen.length > 0 && <li><Link href="/app/auftraege?status=zur_freigabe">{offen.length} Ergebnis{offen.length > 1 ? "se" : ""} prüfen und freigeben</Link></li>}
          <li><Link href="/app/planer">Nächsten Inhalt planen</Link>: einfach in eigenen Worten beschreiben.</li>
          {(lern ?? 0) < 3 && <li>Ergebnisse mit „Gut“ oder „Passt nicht“ bewerten, dann lernt ZEWI Deinen Stil.</li>}
        </ul>
      </section>
      <section className="card" style={{ display: "grid", gap: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}><h3>Zuletzt</h3><Link href="/app/auftraege" className="muted">Download-Center →</Link></div>
        {(jobs ?? []).length === 0 ? (
          <p className="muted">Noch keine Aufträge für dieses Profil.</p>
        ) : (
          <div className="table-scroll"><table className="jobs"><tbody>
            {[...offen, ...freigegeben, ...(jobs ?? []).filter((j) => j.status !== "zur_freigabe" && j.status !== "freigegeben")].slice(0, 6).map((j) => (
              <tr key={j.id}>
                <td><Link href={`/app/auftraege/${j.id}`}>{j.titel || agentById(j.agent)?.name}</Link><br /><span className="tag">{agentById(j.agent)?.name}</span></td>
                <td><StatusChip status={j.status} /></td>
              </tr>
            ))}
          </tbody></table></div>
        )}
      </section>
    </>
  );
}
