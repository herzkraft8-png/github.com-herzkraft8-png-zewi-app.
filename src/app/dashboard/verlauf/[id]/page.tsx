import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { CopyButton } from "@/components/copy-button";
import { deleteGeneration } from "@/app/actions/agent";
import type { SocialPlan } from "@/lib/agents/social-media";

export default async function ResultPage({ params }: PageProps<"/dashboard/verlauf/[id]">) {
  const { id } = await params;
  const { supabase } = await getUser();
  const { data } = await supabase
    .from("generations")
    .select("id, input, output, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const plan = data.output as SocialPlan;
  const input = data.input as { goal: string };

  const fullText = (p: SocialPlan["posts"][number]) =>
    [p.text, p.call_to_action, p.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")]
      .filter(Boolean)
      .join("\n\n");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{new Date(data.created_at).toLocaleString("de-AT")}</p>
          <h1 className="mt-1 text-2xl font-semibold">{input.goal}</h1>
        </div>
        <form action={deleteGeneration}>
          <input type="hidden" name="id" value={data.id} />
          <button className="text-sm text-red-600">Löschen</button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold">Strategie der Woche</h2>
        <p className="mt-2 text-sm">{plan.strategy}</p>
      </div>

      <p className="text-sm text-muted">
        Bitte jeden Beitrag vor dem Posten prüfen. KI kann Fehler machen.
      </p>

      <div className="space-y-4">
        {plan.posts.map((p, i) => (
          <article key={i} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {p.day} · {p.platform} · <span className="text-muted">{p.format}</span>
              </p>
              <CopyButton text={fullText(p)} />
            </div>
            <p className="mt-3 font-semibold">{p.hook}</p>
            <p className="mt-2 whitespace-pre-line text-sm">{p.text}</p>
            <p className="mt-3 text-sm"><span className="font-medium">Aufruf:</span> {p.call_to_action}</p>
            <p className="mt-2 text-sm text-accent">
              {p.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
            </p>
            <p className="mt-3 text-sm text-muted"><span className="font-medium">Bild-/Videoidee:</span> {p.visual_idea}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
