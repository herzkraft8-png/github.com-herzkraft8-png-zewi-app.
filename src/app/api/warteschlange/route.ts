import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET() {
  const sb = await supabaseServer();
  const { data } = await sb.from("jobs").select("id, titel, updated_at").eq("status", "in_arbeit").order("created_at", { ascending: false }).limit(10);
  return NextResponse.json({ jobs: data ?? [] }, { headers: { "cache-control": "no-store" } });
}
