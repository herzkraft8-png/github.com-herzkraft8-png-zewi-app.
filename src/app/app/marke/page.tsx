import { aktuellerNutzer } from "@/lib/supabase";
import { aktiveMarke, zwillingProzent } from "@/lib/marken";
import { kontoLaden, markenLimit } from "@/lib/konto";
import { markeAnlegen, markeLoeschen, markeSpeichern } from "@/lib/aktionen";
import { Bestaetigen } from "@/components/Bestaetigen";
import { IST_CAPITAL, PROFIL_FELDER, TEXTE } from "@/lib/produkt";

const F = PROFIL_FELDER;

export default async function Marke({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const user = (await aktuellerNutzer())!;
  const [{ aktiv: p, alle }, konto] = await Promise.all([aktiveMarke(user.id), kontoLaden(user.id)]);
  const limit = markenLimit(konto, user.email);
  const zw = zwillingProzent(p);
  return (
    <>
      <header>
        <span className="eyebrow">{TEXTE.profilEyebrow}</span>
        <h1>{p.name}</h1>
        <p className="muted">{TEXTE.profilText}</p>
      </header>
      {q.gespeichert && <p className="notice" role="status">Gespeichert. Alle Agenten arbeiten ab jetzt mit diesem Profil.</p>}
      {q.neu && <p className="notice" role="status">Neues Kundenprofil angelegt und aktiv. Jetzt ausfüllen.</p>}
      {q.limit && <p className="notice err">Dein Abo erlaubt {limit} Kundenprofil{limit > 1 ? "e" : ""}. Mehr gibt es mit einem Upgrade.</p>}
      {q.letzte && <p className="notice err">Das letzte Kundenprofil kann nicht gelöscht werden.</p>}
      <div className="card zwilling">
        <div className="row" style={{ justifyContent: "space-between" }}><b>Vollständigkeit</b><span className="mono">{zw} %</span></div>
        <div className="bar" aria-hidden="true"><i style={{ width: `${zw}%` }} /></div>
        {!IST_CAPITAL && <span className="muted" style={{ fontSize: 14 }}>Fotos, Logo und geklonte Stimme kommen mit Version 2 (Video & Audio).</span>}
      </div>
      <form action={markeSpeichern} className="card form two">
        <input type="hidden" name="id" value={p.id} />
        {F.map((f) => (
          <label key={f.key} htmlFor={f.key} style={f.lang ? { gridColumn: "1 / -1" } : undefined}>
            <span className={f.req ? "req" : ""}>{f.label}</span>
            {f.lang ? (
              <textarea id={f.key} name={f.key} defaultValue={(p as Record<string, string>)[f.key] ?? ""} placeholder={f.ph} required={f.req} />
            ) : (
              <input id={f.key} name={f.key} defaultValue={(p as Record<string, string>)[f.key] ?? ""} placeholder={f.ph} required={f.req} />
            )}
          </label>
        ))}
        {IST_CAPITAL ? <input type="hidden" name="anrede" value="du" /> : (
          <label htmlFor="anrede"><span>Kunden ansprechen mit</span>
            <select id="anrede" name="anrede" defaultValue={p.anrede ?? "du"}>
              <option value="du">du</option>
              <option value="Sie">Sie</option>
            </select>
          </label>
        )}
        <div style={{ gridColumn: "1 / -1" }}><button className="btn primary" type="submit">Profil speichern</button></div>
      </form>

      <section className="card" style={{ display: "grid", gap: 14 }}>
        <h3>{IST_CAPITAL ? "Profile" : "Agenturmodus · Kundenprofile"} ({alle.length}/{limit > 400 ? "∞" : limit})</h3>
        <p className="muted">{IST_CAPITAL ? "z. B. ein Profil für das Demokonto und eines für die Challenge." : "Für jeden Kunden ein eigener KI-Zwilling."} Umschalten oben links im Menü.</p>
        <ul className="notizen">
          {alle.map((m) => (
            <li key={m.id}>
              <span><b>{m.name}</b> <span className="muted">· {m.branche || "Branche fehlt"} · {zwillingProzent(m)} %</span>{m.id === p.id && <span className="art notiz" style={{ marginLeft: 8 }}>aktiv</span>}</span>
              {alle.length > 1 && (
                <form action={markeLoeschen}><input type="hidden" name="id" value={m.id} /><Bestaetigen frage={`Kundenprofil „${m.name}“ mit allen Lernnotizen löschen? Aufträge bleiben erhalten.`}>Löschen</Bestaetigen></form>
              )}
            </li>
          ))}
        </ul>
        <form action={markeAnlegen} className="suche">
          <input name="name" placeholder="Name des neuen Kunden" aria-label="Name des neuen Kundenprofils" maxLength={80} />
          <button className="btn" type="submit">Anlegen</button>
        </form>
      </section>
    </>
  );
}
