"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StatusChip } from "./StatusChip";
import { bewerten, freigeben, loeschen } from "@/lib/aktionen";

type Stand = { status: string; ergebnis: string | null; qa_score: number | null; qa_notiz: string | null; runden: number };

function herunterladen(name: string, text: string, typ: string) {
  const url = URL.createObjectURL(new Blob([text], { type: typ }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function JobLive({ id, start, dateiname, bewertung }: { id: string; start: Stand; dateiname: string; bewertung: number | null }) {
  const [bew, setBew] = useState<number | null>(bewertung);
  const [s, setS] = useState<Stand>(start);
  const [wunsch, setWunsch] = useState("");
  const [msg, setMsg] = useState("");
  const [kopiert, setKopiert] = useState(false);

  useEffect(() => {
    if (s.status !== "in_arbeit") return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/auftrag/${id}`, { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (j.status !== "in_arbeit") setS(j);
      }
    }, 4000);
    return () => clearInterval(t);
  }, [id, s.status]);

  async function aendern() {
    setMsg("");
    const r = await fetch(`/api/auftrag/${id}/aendern`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ wunsch }) });
    const j = await r.json();
    if (!r.ok) return setMsg(j.fehler);
    setWunsch("");
    setS({ ...s, status: "in_arbeit" });
  }

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(s.ergebnis ?? "");
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    } catch {
      setMsg("Kopieren nicht möglich – bitte Text markieren und Strg+C drücken.");
    }
  }

  if (s.status === "in_arbeit") {
    return (
      <div className="card row" role="status">
        <div className="spinner" aria-hidden="true" />
        <div>
          <b>Die Agenten arbeiten …</b>
          <p className="muted">Erstellen, Qualitätsprüfung, bei Bedarf Überarbeitung. Meist 1–3 Minuten. Du kannst die Seite offen lassen oder später wiederkommen.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card qa">
        <StatusChip status={s.status} />
        {s.qa_score != null && <span><b>{s.qa_score}</b>/10 Qualität</span>}
        <span className="muted">{s.runden > 1 ? `${s.runden} Durchgänge inkl. Überarbeitung` : "1 Durchgang"}</span>
      </div>
      {s.qa_notiz && s.status !== "freigegeben" && (
        <details className="notice">
          <summary>Hinweise der Qualitätsprüfung</summary>
          <p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{s.qa_notiz}</p>
        </details>
      )}
      {s.ergebnis ? (
        <article className="ergebnis"><ReactMarkdown remarkPlugins={[remarkGfm]}>{s.ergebnis}</ReactMarkdown></article>
      ) : (
        <p className="notice err">Kein Ergebnis vorhanden.</p>
      )}
      <div className="row">
        {s.status === "zur_freigabe" && (
          <form action={freigeben}><input type="hidden" name="id" value={id} /><button className="btn primary" type="submit" onClick={() => setTimeout(() => setS({ ...s, status: "freigegeben" }), 300)}>Freigeben ✓</button></form>
        )}
        <button className="btn" type="button" onClick={kopieren}>{kopiert ? "Kopiert" : "Text kopieren"}</button>
        <button className="btn" type="button" onClick={() => herunterladen(`${dateiname}.md`, s.ergebnis ?? "", "text/markdown")}>Download .md</button>
        <button className="btn" type="button" onClick={() => herunterladen(`${dateiname}.txt`, (s.ergebnis ?? "").replace(/[#*`|]/g, ""), "text/plain")}>Download .txt</button>
      </div>
      <form action={bewerten} className="card daumen" onSubmit={(e) => { const art = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value"); setBew(art === "gut" ? 1 : -1); }}>
        <input type="hidden" name="id" value={id} />
        <label htmlFor="notiz" style={{ flex: "1 1 260px" }}>Learning Agent: Was war gut oder schlecht? (optional)
          <textarea id="notiz" name="notiz" maxLength={600} placeholder="z. B. Genau dieser Ton passt. / Zu lang, weniger Fachwörter." />
        </label>
        <div className="row">
          <button className={`btn ${bew === 1 ? "primary" : ""}`} type="submit" name="art" value="gut">Gut</button>
          <button className={`btn ${bew === -1 ? "primary" : ""}`} type="submit" name="art" value="schlecht">Passt nicht</button>
        </div>
        {bew != null && <span className="muted" style={{ fontSize: 14, flexBasis: "100%" }}>Gespeichert. ZEWI berücksichtigt das bei den nächsten Aufträgen für dieses Kundenprofil.</span>}
      </form>
      {s.status !== "freigegeben" && (
        <div className="card form">
          <label htmlFor="wunsch">Änderungswunsch
            <textarea id="wunsch" value={wunsch} onChange={(e) => setWunsch(e.target.value)} placeholder="z. B. kürzer, mehr Humor, Preis 2.490 € einbauen, Variante B weglassen" />
          </label>
          <div className="row">
            <button className="btn" type="button" onClick={aendern} disabled={!wunsch.trim()}>Überarbeiten lassen</button>
            <span className="muted" style={{ fontSize: 14 }}>Bis zu 3 Änderungsrunden pro Auftrag inklusive.</span>
          </div>
        </div>
      )}
      {msg && <p className="notice err">{msg}</p>}
      <form action={loeschen} onSubmit={(e) => { if (!confirm("Auftrag endgültig löschen?")) e.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="btn small" type="submit">Auftrag löschen</button></form>
    </>
  );
}
