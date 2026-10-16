import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import { agentById } from "@/lib/agenten";
import { JobLive } from "@/components/JobLive";

export default async function Auftrag({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data: job } = await sb.from("jobs").select("*").eq("id", id).maybeSingle();
  if (!job) notFound();
  const agent = agentById(job.agent);
  const briefing = Object.entries(job.briefing ?? {}).filter(([k, v]) => !k.startsWith("_") && v);
  return (
    <>
      <header>
        <Link href="/app/auftraege" className="muted">← Alle Aufträge</Link>
        <span className="eyebrow">{agent?.name}</span>
        <h1>{job.titel}</h1>
      </header>
      {briefing.length > 0 && (
        <details className="card">
          <summary>Briefing anzeigen</summary>
          <dl style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {briefing.map(([k, v]) => (
              <div key={k}><dt className="tag">{agent?.felder.find((f) => f.key === k)?.label ?? k}</dt><dd style={{ margin: 0 }}>{String(v)}</dd></div>
            ))}
          </dl>
        </details>
      )}
      <JobLive
        id={job.id}
        dateiname={`${(agent?.name ?? "zewi").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-")}-${job.created_at.slice(0, 10)}`}
        start={{ status: job.status, ergebnis: job.ergebnis, qa_score: job.qa_score, qa_notiz: job.qa_notiz, runden: job.runden }}
        bewertung={job.bewertung ?? null}
      />
    </>
  );
}
