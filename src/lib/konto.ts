import { supabaseAdmin } from "./supabase";
import { limitFuer, markenLimitFuer, periodeAbgelaufen } from "./plaene";

export type Konto = {
  id: string; plan: string; abo_status: string | null; stripe_customer_id: string | null;
  stripe_subscription_id: string | null; periode_start: string; auftraege_periode: number;
};

/** Konto laden; beginnt ein neuer Monat, wird der Zähler zurückgesetzt. */
export async function kontoLaden(userId: string): Promise<Konto> {
  const admin = supabaseAdmin();
  let { data } = await admin.from("accounts").select("*").eq("id", userId).maybeSingle();
  if (!data) {
    const ins = await admin.from("accounts").insert({ id: userId }).select("*").single();
    data = ins.data;
  }
  if (data && periodeAbgelaufen(data.periode_start)) {
    const heute = new Date();
    const start = `${heute.getUTCFullYear()}-${String(heute.getUTCMonth() + 1).padStart(2, "0")}-01`;
    const upd = await admin.from("accounts").update({ periode_start: start, auftraege_periode: 0 }).eq("id", userId).select("*").single();
    data = upd.data;
  }
  return data as Konto;
}

export function aktivePlan(k: Konto) {
  return k.plan === "pro" && (k.abo_status === "active" || k.abo_status === "trialing") ? "pro" : "free";
}

/** Inhaber-Konten (z. B. info@zewi.ai) ohne Limits – in ZEWI_ADMIN_EMAILS eintragen, durch Komma getrennt. */
export function istInhaber(email?: string | null) {
  const liste = (process.env.ZEWI_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return !!email && liste.includes(email.toLowerCase());
}

export function kontingent(k: Konto, email?: string | null) {
  const limit = istInhaber(email) ? 9999 : limitFuer(aktivePlan(k));
  return { limit, genutzt: k.auftraege_periode, frei: Math.max(0, limit - k.auftraege_periode) };
}

export function markenLimit(k: Konto, email?: string | null) {
  return istInhaber(email) ? 500 : markenLimitFuer(aktivePlan(k));
}
