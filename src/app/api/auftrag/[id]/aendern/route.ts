import { NextResponse, after } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase";
import { jobAusfuehren } from "@/lib/job";

export const maxDuration = 300;
const MAX_AENDERUNGEN = 3;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return NextResponse.json({ fehler: "Bitte zuerst anmelden." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const wunsch = String(body?.wunsch ?? "").trim().slice(0, 2000);
  if (!wunsch) return NextResponse.json({ fehler: "Bitte beschreibe, was geändert werden soll." }, { status: 400 });

  const admin = supabaseAdmin();
  const { data: job } = await admin.from("jobs").select("*").eq("id", id).eq("user_id", data.user.id).single();
  if (!job) return NextResponse.json({ fehler: "Auftrag nicht gefunden." }, { status: 404 });
  if (job.status === "in_arbeit") return NextResponse.json({ fehler: "Der Auftrag wird gerade bearbeitet." }, { status: 409 });
  const anzahl = Number(job.briefing?._aenderungen ?? 0);
  if (anzahl >= MAX_AENDERUNGEN) return NextResponse.json({ fehler: `Pro Auftrag sind ${MAX_AENDERUNGEN} Änderungsrunden inklusive. Starte bei Bedarf einen neuen Auftrag.` }, { status: 429 });

  await admin.from("jobs").update({
    status: "in_arbeit",
    aenderungswunsch: wunsch,
    briefing: { ...job.briefing, _aenderungen: anzahl + 1 },
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  // Learning Agent: Änderungswünsche zeigen, was dem Kunden wichtig ist
  await admin.from("lernnotizen").insert({ user_id: data.user.id, marke_id: job.marke_id, job_id: job.id, agent: job.agent, art: "aenderung", text: wunsch.slice(0, 600) });
  const vorher = job.ergebnis ?? "";
  after(() => jobAusfuehren(id, { vorher, wunsch }));
  return NextResponse.json({ ok: true });
}
