import { notFound } from "next/navigation";
import Link from "next/link";
import { agentById } from "@/lib/agenten";
import { BriefingForm } from "@/components/BriefingForm";

export default async function AgentSeite({ params }: { params: Promise<{ agent: string }> }) {
  const { agent: id } = await params;
  const agent = agentById(id);
  if (!agent) notFound();
  return (
    <>
      <header>
        <Link href="/app/studio" className="muted">← Alle Agenten</Link>
        <span className="eyebrow">{agent.bereich}</span>
        <h1>{agent.name}</h1>
        <p className="muted">{agent.kurz}</p>
      </header>
      <div className="card" style={{ display: "grid", gap: 6 }}>
        <span className="tag">Du bekommst</span>
        <p>{agent.liefert.join(" · ")}</p>
      </div>
      <BriefingForm agentId={agent.id} felder={agent.felder} />
    </>
  );
}
