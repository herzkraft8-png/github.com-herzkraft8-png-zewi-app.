import Link from "next/link";
import { getUser } from "@/lib/supabase/server";

export default async function Dashboard() {
  const { supabase, user } = await getUser();

  const [{ data: profile }, { data: generations }] = await Promise.all([
    supabase.from("profiles").select("offer, api_key_last4").eq("user_id", user!.id).maybeSingle(),
    supabase
      .from("generations")
      .select("id, agent, input, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const needsProfile = !profile?.offer;
  const needsKey = !profile?.api_key_last4;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Übersicht</h1>

      {(needsProfile || needsKey) && (
        <div className="card border-accent">
          <h2 className="font-semibold">Einrichtung abschließen</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>{needsProfile ? "○" : "✓"} Firmenprofil ausfüllen</li>
            <li>{needsKey ? "○" : "✓"} Anthropic-API-Schlüssel hinterlegen</li>
          </ul>
          <Link href="/dashboard/profil" className="btn mt-4">Zum Profil</Link>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold">Social-Media-Agent</h2>
        <p className="mt-1 text-sm text-muted">Erstellt einen Wochenplan mit fertigen Beiträgen für Deine Plattformen.</p>
        <Link href="/dashboard/agent/social" className="btn mt-4">Neuen Wochenplan erstellen</Link>
      </div>

      <section>
        <h2 className="font-semibold">Verlauf</h2>
        {!generations?.length ? (
          <p className="mt-2 text-sm text-muted">Noch keine Ergebnisse.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
            {generations.map((g) => (
              <li key={g.id}>
                <Link href={`/dashboard/verlauf/${g.id}`} className="flex justify-between gap-4 px-4 py-3 text-sm hover:bg-background">
                  <span className="truncate">{(g.input as { goal?: string }).goal ?? "Wochenplan"}</span>
                  <span className="shrink-0 text-muted">
                    {new Date(g.created_at).toLocaleDateString("de-AT")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
