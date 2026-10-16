import { aktuellerNutzer, supabaseServer } from "@/lib/supabase";
import { aktiveMarke } from "@/lib/marken";
import { agentById } from "@/lib/agenten";
import { notizAnlegen, notizLoeschen } from "@/lib/aktionen";

const ART: Record<string, string> = { gut: "Gefiel", schlecht: "Gefiel nicht", aenderung: "Änderung", notiz: "Regel" };

export default async function Lernen() {
  const user = (await aktuellerNutzer())!;
  const { aktiv } = await aktiveMarke(user.id);
  const sb = await supabaseServer();
  const { data: notizen } = await sb.from("lernnotizen").select("*").eq("marke_id", aktiv.id).order("created_at", { ascending: false }).limit(100);
  return (
    <>
      <header>
        <span className="eyebrow">Learning Agent · {aktiv.name}</span>
        <h1>Was ZEWI über Deinen Geschmack gelernt hat</h1>
        <p className="muted">Jede Bewertung und jeder Änderungswunsch landet hier. Die Agenten lesen die neuesten Notizen vor jedem Auftrag und die Qualitätsprüfung kontrolliert sie. Was nicht mehr stimmt, löschst Du einfach.</p>
      </header>
      <form action={notizAnlegen} className="card form">
        <input type="hidden" name="marke_id" value={aktiv.id} />
        <label htmlFor="text">Eigene Regel hinzufügen
          <textarea id="text" name="text" maxLength={600} placeholder="z. B. Immer mit einer Frage an die Leser enden. Nie das Wort „günstig“ verwenden. Lieber kurze Sätze." required />
        </label>
        <div><button className="btn primary" type="submit">Regel speichern</button></div>
      </form>
      <section className="card">
        {(notizen ?? []).length === 0 ? (
          <p className="muted">Noch nichts gelernt. Bewerte Ergebnisse im Download-Center mit „Gut“ oder „Passt nicht“, dann füllt sich diese Liste.</p>
        ) : (
          <ul className="notizen">
            {notizen!.map((n) => (
              <li key={n.id}>
                <div style={{ display: "grid", gap: 4 }}>
                  <div className="row" style={{ gap: 8 }}><span className={`art ${n.art}`}>{ART[n.art] ?? n.art}</span>{n.agent && <span className="tag">{agentById(n.agent)?.name}</span>}<span className="muted mono" style={{ fontSize: 12 }}>{new Date(n.created_at).toLocaleDateString("de-AT")}</span></div>
                  <span>{n.text}</span>
                </div>
                <form action={notizLoeschen}><input type="hidden" name="id" value={n.id} /><button className="btn small" type="submit">Entfernen</button></form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
