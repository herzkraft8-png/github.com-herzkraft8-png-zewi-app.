import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

async function aboSpeichern(sub: Stripe.Subscription) {
  const admin = supabaseAdmin();
  const aktiv = sub.status === "active" || sub.status === "trialing";
  const werte = { plan: aktiv ? "pro" : "free", abo_status: sub.status, stripe_subscription_id: sub.id };
  const userId = sub.metadata?.userId;
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  if (userId) await admin.from("accounts").update({ ...werte, stripe_customer_id: customer }).eq("id", userId);
  else await admin.from("accounts").update(werte).eq("stripe_customer_id", customer);
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ fehler: "Signatur fehlt" }, { status: 400 });
  const roh = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(roh, sig, secret);
  } catch {
    return NextResponse.json({ fehler: "Ungültige Signatur" }, { status: 400 });
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.mode === "subscription" && s.subscription) {
        const sub = await stripe().subscriptions.retrieve(typeof s.subscription === "string" ? s.subscription : s.subscription.id);
        await aboSpeichern(sub);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await aboSpeichern(event.data.object as Stripe.Subscription);
      break;
  }
  return NextResponse.json({ ok: true });
}
