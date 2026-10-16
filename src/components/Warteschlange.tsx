"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type J = { id: string; titel: string; updated_at: string };

export function Warteschlange() {
  const [jobs, setJobs] = useState<J[]>([]);
  useEffect(() => {
    let aus = false;
    let t: ReturnType<typeof setTimeout>;
    async function laden() {
      try {
        const r = await fetch("/api/warteschlange", { cache: "no-store" });
        if (r.ok && !aus) setJobs((await r.json()).jobs ?? []);
      } catch { /* still */ }
      if (!aus) t = setTimeout(laden, jobs.length ? 5000 : 15000);
    }
    laden();
    return () => { aus = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!jobs.length) return null;
  return (
    <div className="queue" role="status">
      <div className="row" style={{ gap: 8 }}><div className="spinner" aria-hidden="true" /><b>ZEWI arbeitet · {jobs.length} aktiv</b></div>
      <ul>
        {jobs.slice(0, 4).map((j) => (
          <li key={j.id}><Link href={`/app/auftraege/${j.id}`}>{j.titel}</Link></li>
        ))}
      </ul>
      <span className="muted" style={{ fontSize: 12 }}>Du kannst inzwischen weiterarbeiten.</span>
    </div>
  );
}
