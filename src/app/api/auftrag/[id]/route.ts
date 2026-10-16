import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data } = await sb.from("jobs").select("id, status, ergebnis, qa_score, qa_notiz, runden, updated_at").eq("id", id).maybeSingle();
  if (!data) return NextResponse.json({ fehler: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
}
