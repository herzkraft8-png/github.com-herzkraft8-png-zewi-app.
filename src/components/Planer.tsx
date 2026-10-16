"use client";
import { useState } from "react";
import type { Feld } from "@/lib/agenten";
import { BriefingForm } from "./BriefingForm";

type A = { id: string; name: string; kurz: string; liefert: string[]; felder: Feld[] };
type Plan = { agent: string; titel: string; begruendung: string; briefing: Record<string, string> };

import { IST_CAPITAL } from "@/lib/produkt";

const BEISPIELE = IST_CAPITAL ? [
  "Erklär mir, wie ich einen Trend erkenne",
  "Ich will einen eigenen Handelsplan für den DAX schreiben",
  "Hilf mir, meine FTMO-Challenge-Regeln durchzurechnen",
  "Ich mache immer Revenge-Trades nach Verlusten",
] : [
  "Ich hätte gern ein Reel über unseren Herbst-Check für Heizungen",
  "Antwort auf eine 2-Sterne-Bewertung: Termin wurde verschoben",
  "Wir suchen einen Lehrling als Elektriker ab September",
  "Posts für nächste Woche, wir haben Freitag Tag der offenen Tür",
];

export function Planer({ agenten }: { agenten: A[] }) {
  const [idee, setIdee] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [wahl, setWahl] = useState<string>("");

  async function planen(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true); setErr(""); setPlan(null);
    try {
      const r = await fetch("/api/planer", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idee }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.fehler);
      setPlan(j); setWahl(j.agent);
    } catch (x) {
      setErr(x instanceof Error ? x.message : String(x));
    } finally { setBusy(false); }
  }

  const agent = agenten.find((a) => a.id === wahl);
  return (
    <>
      <form className="card form planer-box" onSubmit={planen}>
        <label htmlFor="idee">Deine Idee
          <textarea id="idee" value={idee} onChange={(e) => setIdee(e.target.value)} placeholder={IST_CAPITAL ? "z. B. Ich verstehe nicht, wo ich meinen Stop setzen soll" : "z. B. Ich hätte gern ein Reel über unseren Herbst-Check"} maxLength={2000} required />
        </label>
        <div className="chips-row">
          {BEISPIELE.map((b) => <button key={b} type="button" className="chip-link" onClick={() => setIdee(b)}>{b}</button>)}
        </div>
        <div className="row">
          <button className="btn primary" type="submit" disabled={busy || idee.trim().length < 5}>{busy ? "Zentrale überlegt …" : "Planen →"}</button>
          <span className="muted" style={{ fontSize: 14 }}>Planen ist kostenlos. Erst der gestartete Auftrag zählt.</span>
        </div>
        {err && <p className="notice err">{err}</p>}
      </form>

      {plan && agent && (
        <section className="card vorschlag" style={{ display: "grid", gap: 14 }}>
          <span className="eyebrow">{IST_CAPITAL ? "Passender Mentor" : "Vorschlag der Zentrale"}</span>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "grid", gap: 4 }}>
              <h3>{agent.name}</h3>
              <span className="muted">{plan.begruendung}</span>
              <span className="muted" style={{ fontSize: 14 }}>Du bekommst: {agent.liefert.join(" · ")}</span>
            </div>
            <label htmlFor="agent-wahl" style={{ minWidth: 220 }}>Anderen Agenten wählen
              <select id="agent-wahl" value={wahl} onChange={(e) => setWahl(e.target.value)}>
                {agenten.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
          </div>
          <BriefingForm key={wahl} agentId={agent.id} felder={agent.felder} werte={wahl === plan.agent ? plan.briefing : {}} />
        </section>
      )}
    </>
  );
}
