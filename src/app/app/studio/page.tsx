import Link from "next/link";
import { AGENTEN, BEREICHE } from "@/lib/agenten";


export default function Studio() {
  return (
    <>
      <header>
        <span className="eyebrow">Studio</span>
        <h1>Was soll erstellt werden?</h1>
        <p className="muted">Lieber in eigenen Worten? Dann nimm den <Link href="/app/planer">Content Planner</Link>.</p>
      </header>
      {BEREICHE.map((b) => (
        <section key={b} style={{ display: "grid", gap: 12 }}>
          <h3>{b}</h3>
          <div className="agent-pick">
            {AGENTEN.filter((a) => a.bereich === b).map((a) => (
              <Link key={a.id} href={`/app/studio/${a.id}`}>
                <div className="card">
                  <b>{a.name}</b>
                  <span className="muted" style={{ fontSize: 15 }}>{a.kurz}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
