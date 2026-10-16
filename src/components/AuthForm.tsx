"use client";
import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

const FEHLER: Record<string, string> = {
  "Invalid login credentials": "E-Mail oder Passwort stimmt nicht.",
  "Email not confirmed": "Bitte bestätige zuerst Deine E-Mail-Adresse (Link in Deinem Postfach).",
  "User already registered": "Diese E-Mail ist schon registriert. Melde Dich an.",
};

export function AuthForm({ modus, weiter }: { modus: "login" | "registrieren"; weiter?: string }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);

  async function senden(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const sb = supabaseBrowser();
    try {
      if (modus === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        window.location.href = weiter && weiter.startsWith("/app") ? weiter : "/app";
      } else {
        if (!ok) throw new Error("Bitte AGB und Datenschutz bestätigen.");
        const { data, error } = await sb.auth.signUp({
          email,
          password: pw,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?weiter=/app/marke` },
        });
        if (error) throw error;
        if (data.session) window.location.href = "/app/marke";
        else setMsg({ text: "Fast geschafft: Wir haben Dir eine E-Mail geschickt. Klick auf den Link darin, dann geht's los." });
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      setMsg({ text: FEHLER[m] || m, err: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={senden}>
      <label htmlFor="email">E-Mail
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label htmlFor="pw">Passwort {modus === "registrieren" && <small>(mind. 8 Zeichen)</small>}
        <input id="pw" type="password" autoComplete={modus === "login" ? "current-password" : "new-password"} minLength={8} required value={pw} onChange={(e) => setPw(e.target.value)} />
      </label>
      {modus === "registrieren" && (
        <label htmlFor="ok" style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <input id="ok" type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} style={{ width: 18, marginTop: 3 }} />
          <span>Ich akzeptiere die <Link href="/agb">AGB</Link> und habe die <Link href="/datenschutz">Datenschutzerklärung</Link> gelesen.</span>
        </label>
      )}
      {msg && <p className={`notice ${msg.err ? "err" : ""}`} role="status">{msg.text}</p>}
      <button className="btn primary" disabled={busy} type="submit">
        {busy ? "Einen Moment …" : modus === "login" ? "Anmelden" : "Kostenlos registrieren"}
      </button>
    </form>
  );
}
