import Link from "next/link";
import { aktuellerNutzer, supabaseServer } from "@/lib/supabase";
import { AGENTEN, BEREICHE, agentById } from "@/lib/agenten";
import { IST_CAPITAL } from "@/lib/produkt";
import { aktiveMarke } from "@/lib/marken";
import { StatusChip } from "@/components/StatusChip";

const AGENTUR_TYPEN: [string, string, string[]][] = [
  ["", "Alle", []],
  ["posts", "Posts & Reels", ["social", "reel", "google_post", "wochenplan", "kommentar"]],
  ["ads", "Ads", ["meta_ads", "google_ads", "flyer"]],
  ["newsletter", "Newsletter", ["newsletter"]],
  ["blog", "Blog", ["blog"]],
  ["youtube", "YouTube", ["youtube"]],
  ["recruiting", "Recruiting", ["recruiting"]],
  ["alltag", "Alltag", ["kundenmail", "angebot", "mahnung", "bewertung"]],
  ["strategie", "Strategie", ["grand_slam", "einwaende", "board"]],
  ["fenster", "Fenster & Türen", ["fenster_anfrage", "fenster_angebot", "fenster_aufmass", "fenster_referenz", "fenster_saison", "fenster_wartung"]],
  ["gesundheit", "Gesundheit", ["heil_check", "praxis_web", "klienten_info", "gutschein", "workshop", "kooperation"]],
];
const TYPEN: [string, string, string[]][] = IST_CAPITAL
  ? [["", "Alle", []], ...BEREICHE.map((b, i): [string, string, string[]] => [`b${i}`, b, AGENTEN.filter((a) => a.bereich === b).map((a) => a.id)])]
  : AGENTUR_TYPEN;
const STATUS: [string, string][] = [["", "Jeder Status"], ["zur_freigabe", "Zur Freigabe"], ["freigegeben", "Freigegeben"], ["in_arbeit", "In Arbeit"], ["fehler", "Fehler"]];

type Q = { status?: string; typ?: string; q?: string; alle?: string };

function url(q: Q, neu: Partial<Q>) {
  const p = new URLSearchParams();
  const m = { ...q, ...neu };
  for (const [k, v] of Object.entries(m)) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `/app/auftraege?${s}` : "/app/auftraege";
}

export default async function DownloadCenter({ searchParams }: { searchParams: Promise<Q> }) {
  const q = await searchParams;
  const user = (await aktuellerNutzer())!;
  const { aktiv, alle } = await aktiveMarke(user.id);
  const sb = await supabaseServer();
  let abfrage = sb.from("jobs").select("id, agent, titel, status, qa_score, bewertung, marke_id, created_at").order("created_at", { ascending: false }).limit(200);
  if (!q.alle) abfrage = abfrage.eq("marke_id", aktiv.id);
  if (q.status) abfrage = abfrage.eq("status", q.status);
  const typ = TYPEN.find(([k]) => k === (q.typ ?? ""));
  if (typ && typ[2].length) abfrage = abfrage.in("agent", typ[2]);
  const such = (q.q ?? "").trim().slice(0, 80).replace(/[%_,()]/g, " ");
  if (such) abfrage = abfrage.or(`titel.ilike.%${such}%,ergebnis.ilike.%${such}%`);
  const { data: jobs } = await abfrage;
  const markenName = Object.fromEntries(alle.map((m) => [m.id, m.name]));
  return (
    <>
      <header>
        <span className="eyebrow">Download-Center · {q.alle ? "alle Kundenprofile" : aktiv.name}</span>
        <h1>Dein fertiger Content</h1>
        <p className="muted">Nichts wird automatisch veröffentlicht. Prüfen, ändern lassen, freigeben, herunterladen.</p>
      </header>
      <div className="chips-row">
        {TYPEN.map(([k, l]) => <Link key={k} href={url(q, { typ: k })} className={`chip-link ${(q.typ ?? "") === k ? "on" : ""}`}>{l}</Link>)}
      </div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="chips-row">
          {STATUS.map(([k, l]) => <Link key={k} href={url(q, { status: k })} className={`chip-link ${(q.status ?? "") === k ? "on" : ""}`}>{l}</Link>)}
          {alle.length > 1 && <Link href={url(q, { alle: q.alle ? "" : "1" })} className={`chip-link ${q.alle ? "on" : ""}`}>Alle Kundenprofile</Link>}
        </div>
        <form className="suche" action="/app/auftraege">
          {q.typ && <input type="hidden" name="typ" value={q.typ} />}
          {q.status && <input type="hidden" name="status" value={q.status} />}
          {q.alle && <input type="hidden" name="alle" value="1" />}
          <input name="q" defaultValue={q.q ?? ""} placeholder="Suchen …" aria-label="Aufträge durchsuchen" />
          <button className="btn small" type="submit">Suchen</button>
        </form>
      </div>
      {(jobs ?? []).length === 0 ? (
        <div className="card"><p className="muted">Keine Aufträge gefunden. <Link href="/app/planer">Neuen Inhalt planen →</Link></p></div>
      ) : (
        <div className="card table-scroll">
          <table className="jobs">
            <thead><tr><th>Auftrag</th><th>Status</th><th>Qualität</th><th>Datum</th></tr></thead>
            <tbody>
              {jobs!.map((j) => (
                <tr key={j.id}>
                  <td>
                    <Link href={`/app/auftraege/${j.id}`}>{j.titel || agentById(j.agent)?.name}</Link><br />
                    <span className="tag">{agentById(j.agent)?.name}{q.alle && j.marke_id ? ` · ${markenName[j.marke_id] ?? ""}` : ""}</span>
                    {j.bewertung === 1 && <span className="art gut" style={{ marginLeft: 6 }}>gut</span>}
                    {j.bewertung === -1 && <span className="art schlecht" style={{ marginLeft: 6 }}>passt nicht</span>}
                  </td>
                  <td><StatusChip status={j.status} /></td>
                  <td className="mono">{j.qa_score ? `${j.qa_score}/10` : "–"}</td>
                  <td className="muted mono" style={{ whiteSpace: "nowrap" }}>{new Date(j.created_at).toLocaleDateString("de-AT")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
