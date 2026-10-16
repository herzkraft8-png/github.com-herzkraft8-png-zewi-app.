import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase";
import { kontoLaden } from "@/lib/konto";
import { basisUrl, stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  const price = process.env.STRIPE_PRICE_PRO;
  if (!price) return NextResponse.json({ fehler: "STRIPE_PRICE_PRO fehlt" }, { status: 500 });

  const konto = await kontoLaden(data.user.id);
  const s = stripe();
  let customer = konto.stripe_customer_id;
  if (!customer) {
    const c = await s.customers.create({ email: data.user.email ?? undefined, metadata: { userId: data.user.id } });
    customer = c.id;
    await supabaseAdmin().from("accounts").update({ stripe_customer_id: customer }).eq("id", data.user.id);
  }
  const basis = basisUrl(req);
  const session = await s.checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price, quantity: 1 }],
    client_reference_id: data.user.id,
    subscription_data: { metadata: { userId: data.user.id } },
    allow_promotion_codes: true,
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    customer_update: { address: "auto", name: "auto" },
    success_url: `${basis}/app/abo?ok=1`,
    cancel_url: `${basis}/app/abo`,
  });
  return NextResponse.redirect(session.url!, { status: 303 });
}
