import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function supabaseKonfiguriert() {
  return Boolean(url() && anon());
}

/** Client im Namen des eingeloggten Nutzers (RLS greift). */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(url(), anon(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // in Server Components nicht erlaubt – die Middleware erneuert die Sitzung
        }
      },
    },
  });
}

/** Admin-Client mit Service-Key: nur auf dem Server, umgeht RLS. */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY fehlt");
  return createClient(url(), key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function aktuellerNutzer() {
  if (!supabaseKonfiguriert()) return null;
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}
