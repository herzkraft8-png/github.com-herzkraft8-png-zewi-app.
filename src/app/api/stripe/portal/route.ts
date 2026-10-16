import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { kontoLaden } from "@/lib/konto";
import { basisUrl, stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  const konto = await kontoLaden(data.user.id);
  if (!konto.stripe_customer_id) return NextResponse.redirect(new URL("/app/abo", req.url), { status: 303 });
  const portal = await stripe().billingPortal.sessions.create({ customer: konto.stripe_customer_id, return_url: `${basisUrl(req)}/app/abo` });
  return NextResponse.redirect(portal.url, { status: 303 });
}
