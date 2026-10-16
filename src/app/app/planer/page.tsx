import { AGENTEN } from "@/lib/agenten";
import { Planer } from "@/components/Planer";
import { aktuellerNutzer } from "@/lib/supabase";
import { aktiveMarke } from "@/lib/marken";
import { IST_CAPITAL } from "@/lib/produkt";

export default async function PlanerSeite() {
  const user = (await aktuellerNutzer())!;
  const { aktiv } = await aktiveMarke(user.id);
  const agenten = AGENTEN.map((a) => ({ id: a.id, name: a.name, kurz: a.kurz, liefert: a.liefert, felder: a.felder }));
  return (
    <>
      <header>
        <span className="eyebrow">{IST_CAPITAL ? "Lern-Planer" : "Content Planner"} · {aktiv.name}</span>
        <h1>{IST_CAPITAL ? "Was willst Du heute lernen?" : "Was brauchst Du?"}</h1>
        <p className="muted">{IST_CAPITAL ? "Schreib Deine Frage oder Dein Problem in eigenen Worten. ZEWI wählt den passenden Mentor und bereitet alles vor." : "Schreib es so, wie Du es einem Mitarbeiter sagen würdest. Die ZEWI-Zentrale wählt den passenden Agenten und füllt das Briefing vor. Du prüfst und startest."}</p>
      </header>
      <Planer agenten={agenten} />
    </>
  );
}
