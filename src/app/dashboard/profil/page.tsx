import { getUser } from "@/lib/supabase/server";
import { ApiKeyForm, ProfileForm } from "./forms";

export default async function ProfilPage() {
  const { supabase, user } = await getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, offer, audience, tone, extra_notes, api_key_last4")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Profil</h1>

      <section className="card">
        <h2 className="font-semibold">Dein Unternehmen</h2>
        <p className="mt-1 text-sm text-muted">
          Je genauer diese Angaben, desto weniger generisch klingen die Ergebnisse.
        </p>
        <ProfileForm
          initial={{
            business_name: profile?.business_name ?? "",
            offer: profile?.offer ?? "",
            audience: profile?.audience ?? "",
            tone: profile?.tone ?? "",
            extra_notes: profile?.extra_notes ?? "",
          }}
        />
      </section>

      <section className="card">
        <h2 className="font-semibold">Anthropic-API-Schlüssel</h2>
        <p className="mt-1 text-sm text-muted">
          Die KI-Kosten laufen direkt über Dein eigenes Anthropic-Konto. Der Schlüssel wird
          verschlüsselt gespeichert und nie wieder angezeigt.
        </p>
        <ApiKeyForm last4={profile?.api_key_last4 ?? null} />

        <details className="mt-6 text-sm">
          <summary className="cursor-pointer font-medium">So bekommst Du Deinen Schlüssel</summary>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted">
            <li>Auf <a className="text-accent" href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a> ein Konto anlegen.</li>
            <li>Unter „Billing“ Guthaben aufladen (die Abrechnung erfolgt nach Nutzung).</li>
            <li>Unter „API Keys“ auf „Create Key“ klicken und den Schlüssel kopieren.</li>
            <li>Hier einfügen und speichern.</li>
            <li>Tipp: In der Anthropic-Konsole ein monatliches Ausgabenlimit setzen.</li>
          </ol>
        </details>
      </section>
    </div>
  );
}
