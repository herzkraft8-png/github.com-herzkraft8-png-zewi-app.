import { redirect } from "next/navigation";
import { Logo } from "@/components/Public";
import { SideNav } from "@/components/SideNav";
import { MarkenWahl } from "@/components/MarkenWahl";
import { Warteschlange } from "@/components/Warteschlange";
import { aktuellerNutzer, supabaseKonfiguriert } from "@/lib/supabase";
import { aktivePlan, istInhaber, kontingent, kontoLaden } from "@/lib/konto";
import { aktiveMarke } from "@/lib/marken";
import { PLAENE } from "@/lib/plaene";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseKonfiguriert()) {
    return (
      <main className="wrap legal">
        <h1>Noch nicht eingerichtet</h1>
        <p className="notice">Die Verbindung zu Supabase fehlt. Trag die Schlüssel laut Anleitung (EINRICHTEN.md) in die Umgebungsvariablen ein.</p>
      </main>
    );
  }
  const user = await aktuellerNutzer();
  if (!user) redirect("/login");
  const [konto, { aktiv, alle }] = await Promise.all([kontoLaden(user.id), aktiveMarke(user.id)]);
  const k = kontingent(konto, user.email);
  const plan = istInhaber(user.email) ? "ZEWI Inhaber" : PLAENE[aktivePlan(konto)].name;
  return (
    <div className="shell">
      <aside className="side">
        <Logo />
        <MarkenWahl aktiv={aktiv.id} alle={alle.map((m) => ({ id: m.id, name: m.name }))} />
        <SideNav />
        <Warteschlange />
        <div className="usage">
          <span><b>{plan}</b> · {k.genutzt} von {k.limit > 9000 ? "∞" : k.limit} Aufträgen</span>
          <div className="bar" aria-hidden="true"><i style={{ width: `${Math.min(100, (k.genutzt / k.limit) * 100)}%` }} /></div>
          <span className="muted">{user.email}</span>
          <form action="/auth/abmelden" method="post"><button className="btn small" type="submit">Abmelden</button></form>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
