import { NextResponse, after } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase";
import { agentById } from "@/lib/agenten";
import { kontingent, kontoLaden } from "@/lib/konto";
import { jobAusfuehren } from "@/lib/job";
import { aktiveMarke } from "@/lib/marken";

export const maxDuration = 300;

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return NextResponse.json({ fehler: "Bitte zuerst anmelden." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const agent = agentById(String(body?.agent ?? ""));
  if (!agent) return NextResponse.json({ fehler: "Unbekannter Agent." }, { status: 400 });

  const briefing: Record<string, string> = {};
  for (const f of agent.felder) {
    const v = String(body?.briefing?.[f.key] ?? "").trim().slice(0, f.typ === "textarea" ? 4000 : 300);
    if (f.pflicht && !v) return NextResponse.json({ fehler: `Bitte "${f.label}" ausfüllen.` }, { status: 400 });
    if (f.typ === "select" && v && !f.optionen!.includes(v)) return NextResponse.json({ fehler: `Ungültige Auswahl bei "${f.label}".` }, { status: 400 });
    briefing[f.key] = v;
  }

  const konto = await kontoLaden(data.user.id);
  const k = kontingent(konto, data.user.email);
  if (k.frei <= 0) {
    return NextResponse.json({ fehler: `Dein Kontingent von ${k.limit} Aufträgen ist für diesen Monat aufgebraucht. Unter „Abo“ kannst Du upgraden.` }, { status: 402 });
  }

  const admin = supabaseAdmin();
  // Zähler nur erhöhen, wenn er sich seit dem Lesen nicht verändert hat (verhindert Doppelklick-Rennen)
  const { data: gezaehlt } = await admin.from("accounts")
    .update({ auftraege_periode: konto.auftraege_periode + 1 })
    .eq("id", data.user.id).eq("auftraege_periode", konto.auftraege_periode).select("id");
  if (!gezaehlt?.length) return NextResponse.json({ fehler: "Bitte noch einmal versuchen." }, { status: 409 });

  const { aktiv } = await aktiveMarke(data.user.id);
  const erste = Object.values(briefing).find(Boolean) ?? "";
  const titel = `${agent.name}: ${erste}`.slice(0, 90);
  const { data: job, error } = await admin.from("jobs")
    .insert({ user_id: data.user.id, marke_id: aktiv?.id ?? null, agent: agent.id, titel, briefing, status: "in_arbeit" })
    .select("id").single();
  if (error || !job) return NextResponse.json({ fehler: "Auftrag konnte nicht gespeichert werden." }, { status: 500 });

  after(() => jobAusfuehren(job.id));
  return NextResponse.json({ id: job.id });
}
