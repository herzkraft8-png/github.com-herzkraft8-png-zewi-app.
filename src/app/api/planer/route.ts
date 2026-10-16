import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { AGENTEN } from "@/lib/agenten";
import { aktiveMarke } from "@/lib/marken";
import { planen, type Profil } from "@/lib/ki";

export const maxDuration = 60;

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return NextResponse.json({ fehler: "Bitte zuerst anmelden." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const idee = String(body?.idee ?? "").trim();
  if (idee.length < 5) return NextResponse.json({ fehler: "Beschreib Deine Idee in ein, zwei Sätzen." }, { status: 400 });
  const { aktiv } = await aktiveMarke(data.user.id);
  try {
    const plan = await planen(idee, aktiv as unknown as Profil, AGENTEN);
    return NextResponse.json(plan);
  } catch (e) {
    console.error("Planer", e);
    return NextResponse.json({ fehler: "Die Zentrale war nicht erreichbar. Wähl den Agenten bitte selbst unter „Alle Agenten“." }, { status: 502 });
  }
}
