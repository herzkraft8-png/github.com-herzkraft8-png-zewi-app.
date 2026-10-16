# Zewi – KI-Marketing-Agenten für Coaches und Berater

Kunden legen ein Firmenprofil an, verbinden **ihren eigenen Anthropic-API-Schlüssel** (sie zahlen die KI selbst)
und lassen sich vom Social-Media-Agenten einen fertigen Wochenplan schreiben.

**Stack:** Next.js 16 · Supabase (Login + Datenbank) · Claude API · Tailwind · Hosting z. B. auf Vercel

## Was die erste Version kann

- Registrierung und Login per E-Mail (Supabase)
- Firmenprofil: Angebot, Zielgruppe, Tonalität
- Eigener API-Schlüssel des Kunden, AES-256-GCM-verschlüsselt gespeichert, nie wieder angezeigt
- **Social-Media-Agent:** Ziel, Thema, Plattformen, Anzahl → Wochenplan mit Hook, Text, Call-to-Action, Hashtags, Bildidee
- Verlauf aller Ergebnisse, Kopieren per Klick, Löschen
- Jeder Kunde sieht nur seine eigenen Daten (Row Level Security)

Bewusst **nicht** drin: automatisches Posten (Haftungsrisiko), Bezahlung, weitere Agenten.

## Einrichtung (ca. 15 Minuten)

1. **Supabase-Projekt** auf supabase.com anlegen.
2. Im Supabase-Dashboard → *SQL Editor* den Inhalt von `supabase/schema.sql` ausführen.
3. `.env.example` nach `.env.local` kopieren und ausfüllen:
   - `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` aus *Project Settings → API*
   - `ENCRYPTION_KEY` erzeugen: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
     **Gut aufbewahren und nie ändern**, sonst sind gespeicherte Kunden-Schlüssel unlesbar.
4. In Supabase → *Authentication → URL Configuration* die Site-URL und `…/auth/callback` als Redirect-URL eintragen.
5. Starten:
   ```bash
   npm install
   npm run dev
   ```
   → http://localhost:3000

## Live stellen (Vercel)

Repo in Vercel importieren, dieselben Umgebungsvariablen eintragen, `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen.

## Rechtliches vor dem Start (nicht optional)

- Datenschutzerklärung und Impressum (Österreich: ECG/MedienG, DSGVO)
- Auftragsverarbeitungsverträge mit Supabase und Vercel; Region EU wählen
- Hinweis an Kunden, dass Eingaben an Anthropic übermittelt werden
- AGB mit Haftungsausschluss für KI-generierte Inhalte

## Struktur

```
src/
  app/
    page.tsx                 Landingpage
    login/                   Login & Registrierung
    auth/callback/           Bestätigungslink aus der E-Mail
    dashboard/               Übersicht + Verlauf
    dashboard/profil/        Firmenprofil + API-Schlüssel
    dashboard/agent/social/  Social-Media-Agent
    dashboard/verlauf/[id]/  Ergebnisansicht
    actions/                 Server-Aktionen (Auth, Profil, Agent)
  lib/
    agents/social-media.ts   Prompt + Claude-Aufruf (strukturierte Ausgabe)
    crypto.ts                Verschlüsselung der Kunden-Schlüssel
    supabase/server.ts       Supabase-Client
  proxy.ts                   Session-Refresh + Schutz von /dashboard
supabase/schema.sql          Tabellen + Row Level Security
```

## Nächste Schritte

1. Mit 3–5 echten Coaches testen und Prompts nach Feedback schärfen
2. Bezahlung für die App (Stripe-Abo)
3. Weitere Agenten: Werbeanzeigen, Newsletter, Blogartikel
