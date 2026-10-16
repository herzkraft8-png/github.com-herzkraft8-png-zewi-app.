"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin, supabaseServer } from "./supabase";
import { MARKEN_COOKIE } from "./marken";
import { kontoLaden, markenLimit } from "./konto";

const FELDER = ["name", "firma", "branche", "ort", "website", "angebot", "zielgruppe", "ton", "anrede", "besonderheiten", "tabus", "plattformen", "frequenz"] as const;

async function nutzer() {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/login");
  return { sb, user: data.user };
}

function cookieSetzen(store: Awaited<ReturnType<typeof cookies>>, id: string) {
  store.set(MARKEN_COOKIE, id, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });
}

// ---------- Kundenprofile (Agenturmodus) ----------

export async function markeSpeichern(form: FormData) {
  const { sb, user } = await nutzer();
  const id = String(form.get("id"));
  const werte: Record<string, string> = {};
  for (const f of FELDER) werte[f] = String(form.get(f) ?? "").slice(0, 2000);
  if (!werte.name.trim()) werte.name = werte.firma || "Kundenprofil";
  await sb.from("marken").update({ ...werte, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/app", "layout");
  redirect("/app/marke?gespeichert=1");
}

export async function markeWechseln(form: FormData) {
  const { sb } = await nutzer();
  const id = String(form.get("id"));
  const { data } = await sb.from("marken").select("id").eq("id", id).maybeSingle();
  if (data) cookieSetzen(await cookies(), id);
  revalidatePath("/app", "layout");
  const ziel = String(form.get("zurueck") ?? "/app");
  redirect(ziel.startsWith("/app") ? ziel : "/app");
}

export async function markeAnlegen(form: FormData) {
  const { sb, user } = await nutzer();
  const konto = await kontoLaden(user.id);
  const limit = markenLimit(konto, user.email);
  const { count } = await sb.from("marken").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= limit) redirect("/app/marke?limit=1");
  const name = String(form.get("name") ?? "").trim().slice(0, 80) || "Neues Kundenprofil";
  const { data } = await supabaseAdmin().from("marken").insert({ user_id: user.id, name, firma: name }).select("id").single();
  if (data) cookieSetzen(await cookies(), data.id);
  revalidatePath("/app", "layout");
  redirect("/app/marke?neu=1");
}

export async function markeLoeschen(form: FormData) {
  const { sb, user } = await nutzer();
  const id = String(form.get("id"));
  const { count } = await sb.from("marken").select("id", { count: "exact", head: true });
  if ((count ?? 0) <= 1) redirect("/app/marke?letzte=1");
  await supabaseAdmin().from("marken").delete().eq("id", id).eq("user_id", user.id);
  (await cookies()).delete(MARKEN_COOKIE);
  revalidatePath("/app", "layout");
  redirect("/app/marke");
}

// ---------- Freigabe ----------

export async function freigeben(form: FormData) {
  const id = String(form.get("id"));
  const { user } = await nutzer();
  await supabaseAdmin().from("jobs").update({ status: "freigegeben", updated_at: new Date().toISOString() })
    .eq("id", id).eq("user_id", user.id).eq("status", "zur_freigabe");
  revalidatePath(`/app/auftraege/${id}`);
  revalidatePath("/app/auftraege");
}

export async function loeschen(form: FormData) {
  const id = String(form.get("id"));
  const { sb } = await nutzer();
  await sb.from("jobs").delete().eq("id", id);
  revalidatePath("/app/auftraege");
  redirect("/app/auftraege");
}

// ---------- Learning Agent ----------

export async function bewerten(form: FormData) {
  const { user } = await nutzer();
  const id = String(form.get("id"));
  const art = String(form.get("art")) === "gut" ? "gut" : "schlecht";
  const notiz = String(form.get("notiz") ?? "").trim().slice(0, 600);
  const admin = supabaseAdmin();
  const { data: job } = await admin.from("jobs").select("id, agent, marke_id, titel").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!job) return;
  await admin.from("jobs").update({ bewertung: art === "gut" ? 1 : -1 }).eq("id", id);
  const text = notiz || (art === "gut" ? `Ergebnis "${job.titel}" war passend – Stil und Länge beibehalten.` : `Ergebnis "${job.titel}" hat nicht gepasst.`);
  await admin.from("lernnotizen").insert({ user_id: user.id, marke_id: job.marke_id, job_id: job.id, agent: job.agent, art, text });
  revalidatePath(`/app/auftraege/${id}`);
  revalidatePath("/app/lernen");
}

export async function notizAnlegen(form: FormData) {
  const { user, sb } = await nutzer();
  const text = String(form.get("text") ?? "").trim().slice(0, 600);
  const markeId = String(form.get("marke_id") ?? "");
  if (!text) return;
  const { data: m } = await sb.from("marken").select("id").eq("id", markeId).maybeSingle();
  if (!m) return;
  await supabaseAdmin().from("lernnotizen").insert({ user_id: user.id, marke_id: m.id, art: "notiz", text });
  revalidatePath("/app/lernen");
}

export async function notizLoeschen(form: FormData) {
  const { sb } = await nutzer();
  await sb.from("lernnotizen").delete().eq("id", String(form.get("id")));
  revalidatePath("/app/lernen");
}
