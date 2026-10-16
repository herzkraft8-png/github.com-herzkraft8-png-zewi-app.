"use client";
import { useState } from "react";
import type { Feld } from "@/lib/agenten";

export function BriefingForm({ agentId, felder, werte = {} }: { agentId: string; felder: Feld[]; werte?: Record<string, string> }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function senden(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const briefing = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    try {
      const r = await fetch("/api/auftrag", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agent: agentId, briefing }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.fehler || "Auftrag konnte nicht gestartet werden.");
      window.location.href = `/app/auftraege/${j.id}`;
    } catch (x) {
      setErr(x instanceof Error ? x.message : String(x));
      setBusy(false);
    }
  }

  return (
    <form className="card form two" onSubmit={senden}>
      {felder.map((f) => (
        <label key={f.key} htmlFor={f.key} style={f.typ === "textarea" ? { gridColumn: "1 / -1" } : undefined}>
          <span className={f.pflicht ? "req" : ""}>{f.label}</span>
          {f.typ === "textarea" ? (
            <textarea id={f.key} name={f.key} placeholder={f.placeholder} required={f.pflicht} maxLength={4000} defaultValue={werte[f.key] ?? ""} />
          ) : f.typ === "select" ? (
            <select id={f.key} name={f.key} defaultValue={werte[f.key] || undefined}>{f.optionen!.map((o) => <option key={o}>{o}</option>)}</select>
          ) : (
            <input id={f.key} name={f.key} placeholder={f.placeholder} required={f.pflicht} maxLength={300} defaultValue={werte[f.key] ?? ""} />
          )}
        </label>
      ))}
      {err && <p className="notice err" style={{ gridColumn: "1 / -1" }}>{err}</p>}
      <div style={{ gridColumn: "1 / -1" }} className="row">
        <button className="btn primary" type="submit" disabled={busy}>{busy ? "Wird gestartet …" : "Auftrag starten →"}</button>
        <span className="muted" style={{ fontSize: 14 }}>Dauer meist 1–3 Minuten inkl. Qualitätsprüfung. Zählt als 1 Auftrag.</span>
      </div>
    </form>
  );
}
