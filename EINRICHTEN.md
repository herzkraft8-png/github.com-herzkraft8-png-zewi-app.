# ZEWI App – Einrichten (Schritt für Schritt)

Dauer: ca. 1–2 Stunden. Schlüssel und Passwörter gibst nur Du ein – nie in einen Chat.

## Was Du brauchst (Konten)
| Dienst | Wofür | Kosten zum Start (bitte selbst prüfen) |
|---|---|---|
| GitHub | Code-Ablage | gratis |
| Supabase | Login + Datenbank | Free-Plan; Pro ca. 25 $/Monat, wenn es wächst |
| Vercel | Hosting der App | Hobby gratis (nur privat!) – für ein Geschäft Pro ca. 20 $/Monat |
| Anthropic (console.anthropic.com) | KI der Agenten | nach Verbrauch, Guthaben aufladen |
| Stripe | Abo-Zahlungen | keine Grundgebühr, Gebühr pro Zahlung |

## 1. Supabase
1. supabase.com → Konto → **New project** → Region **Frankfurt (eu-central-1)**.
2. Links **SQL Editor** → New query → Inhalt von `supabase/schema.sql` einfügen → **Run**.
3. **Authentication → URL Configuration**: Site URL = Deine App-Adresse (z. B. https://app.zewi.at), Redirect URL `https://app.zewi.at/auth/callback` hinzufügen.
4. **Authentication → Emails**: Texte auf Deutsch anpassen (optional). Für echten Betrieb eigenen SMTP eintragen (info@zewi.ai über Hostinger), sonst ist der Versand stark begrenzt.
5. **Project Settings → API**: `Project URL`, `anon key`, `service_role key` notieren.

## 2. Anthropic
console.anthropic.com → Billing (Guthaben, z. B. 20 €) → **API Keys** → Schlüssel erstellen.
Tipp: Unter Limits ein Monatslimit setzen, damit die Kosten nie davonlaufen.

## 3. Stripe
1. dashboard.stripe.com → Konto (zuerst im **Testmodus** bleiben).
2. **Produkte** → „ZEWI Pro“ → Preis 99 € monatlich, wiederkehrend → Preis-ID `price_…` notieren.
3. **Entwickler → API-Schlüssel**: Secret key `sk_test_…`.
4. **Einstellungen → Abrechnung → Kundenportal** aktivieren (Kündigen, Zahlungsmethode ändern).
5. Webhook kommt nach Schritt 5.

## 4. Code auf GitHub
github.com → **New repository** „zewi-app“ (privat) → die Dateien aus diesem Ordner hochladen (oder ich mache das, sobald das leere Repo existiert).

## 5. Vercel
1. vercel.com → mit GitHub anmelden → **Add New Project** → „zewi-app“ importieren.
2. **Environment Variables**: alle Werte aus `.env.example` eintragen. Bei `ZEWI_ADMIN_EMAILS` Deine eigene Login-Adresse – damit hast Du als Agentur-Inhaber unbegrenzt Kundenprofile und Aufträge.
3. **Deploy**. Danach unter **Domains** z. B. `app.zewi.at` hinzufügen und den angezeigten DNS-Eintrag bei Hostinger setzen.
4. Stripe → **Entwickler → Webhooks** → Endpoint `https://app.zewi.at/api/stripe/webhook` mit den Ereignissen
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   → Signing secret `whsec_…` in Vercel als `STRIPE_WEBHOOK_SECRET` eintragen → neu deployen.

## 6. Testen (Testmodus)
1. Registrieren → Bestätigungsmail → Markenprofil ausfüllen.
2. Auftrag „Kundenmail beantworten“ starten → nach 1–2 Min. Ergebnis → freigeben → Download.
3. Abo → Upgrade → Stripe-Testkarte `4242 4242 4242 4242`, beliebiges künftiges Datum, beliebige CVC → zurück in die App → „ZEWI Pro“.
4. Erst wenn alles läuft: Stripe auf Live schalten, Live-Schlüssel tauschen.

## Vor dem Live-Start (Pflicht)
- Impressum, Datenschutz, AGB ausfüllen und juristisch prüfen lassen (gelb markierte Stellen).
- Gewerbe klären (WKO): Werbeagentur / IT-Dienstleistung.
- Preise brutto/netto und Kleinunternehmerregelung mit Steuerberater klären.
- Auftragsverarbeitungsverträge (Supabase, Vercel, Stripe, Anthropic) in den jeweiligen Konten akzeptieren.

## Lokal starten (für Entwickler)
```
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev                  # http://localhost:3000
```

## Zweite App: ZEWI Capital Akademie
Gleicher Code, eigene Marke. Dafür:
1. In Supabase ein **zweites Projekt** anlegen (z. B. `zewi-capital`) und dieselbe Datei `ZEWI_Datenbank.sql` ausführen. So sind Agentur- und Trading-Kunden sauber getrennt.
2. In Stripe ein zweites Produkt „Akademie Pro“ (Vorschlag 49 € monatlich) anlegen.
3. In Vercel ein **zweites Projekt** aus demselben GitHub-Repo importieren und `NEXT_PUBLIC_ZEWI_PRODUKT=capital` plus die Schlüssel des zweiten Supabase-Projekts eintragen.
4. Domain z. B. `akademie.zewi.ai`.
Vor dem Start: AGB/Risikohinweis juristisch prüfen lassen (FMA/WAG 2018), dass es eine reine Lernplattform ohne Anlageberatung ist.
