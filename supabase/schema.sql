-- ZEWI App – Datenbank-Schema (Version 2: Agenturmodus + Learning Agent)
-- In Supabase: SQL Editor -> New query -> diesen ganzen Text einfügen -> Run

-- 1) Kundenprofile / Marken ("KI-Zwilling") – ein Nutzer kann mehrere haben (Agenturmodus)
create table if not exists public.marken (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Mein Betrieb',
  firma text default '',
  branche text default '',
  ort text default '',
  website text default '',
  angebot text default '',
  zielgruppe text default '',
  ton text default 'freundlich, klar, kompetent',
  anrede text default 'du',
  besonderheiten text default '',
  tabus text default '',
  plattformen text default '',
  frequenz text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists marken_user on public.marken(user_id, created_at);

-- 2) Konto & Abo – Nutzer darf nur LESEN, schreiben nur der Server
create table if not exists public.accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',
  abo_status text default null,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  periode_start date not null default date_trunc('month', now())::date,
  auftraege_periode int not null default 0,
  created_at timestamptz default now()
);

-- 3) Aufträge
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  marke_id uuid references public.marken(id) on delete set null,
  agent text not null,
  titel text not null default '',
  briefing jsonb not null default '{}'::jsonb,
  status text not null default 'in_arbeit',     -- in_arbeit | zur_freigabe | freigegeben | fehler
  ergebnis text default '',
  qa_score int,
  qa_notiz text default '',
  runden int not null default 0,
  aenderungswunsch text default '',
  bewertung int,                                 -- 1 = gut, -1 = schlecht (Learning Agent)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.jobs add column if not exists marke_id uuid references public.marken(id) on delete set null;
alter table public.jobs add column if not exists bewertung int;
create index if not exists jobs_user_created on public.jobs(user_id, created_at desc);
create index if not exists jobs_marke on public.jobs(marke_id, created_at desc);

-- 4) Learning Agent: was hat dem Kunden gefallen / nicht gefallen
create table if not exists public.lernnotizen (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  marke_id uuid references public.marken(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  agent text,
  art text not null default 'notiz',             -- gut | schlecht | aenderung | notiz
  text text not null,
  created_at timestamptz default now()
);
create index if not exists lern_marke on public.lernnotizen(marke_id, created_at desc);

-- Row Level Security
alter table public.marken enable row level security;
alter table public.accounts enable row level security;
alter table public.jobs enable row level security;
alter table public.lernnotizen enable row level security;

drop policy if exists "marken lesen" on public.marken;
drop policy if exists "marken aendern" on public.marken;
create policy "marken lesen" on public.marken for select using (auth.uid() = user_id);
create policy "marken aendern" on public.marken for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Anlegen/Löschen von Marken macht der Server (Plan-Limit wird geprüft).

drop policy if exists "konto lesen" on public.accounts;
create policy "konto lesen" on public.accounts for select using (auth.uid() = id);

drop policy if exists "jobs lesen" on public.jobs;
drop policy if exists "jobs loeschen" on public.jobs;
create policy "jobs lesen" on public.jobs for select using (auth.uid() = user_id);
create policy "jobs loeschen" on public.jobs for delete using (auth.uid() = user_id);

drop policy if exists "lern lesen" on public.lernnotizen;
drop policy if exists "lern loeschen" on public.lernnotizen;
create policy "lern lesen" on public.lernnotizen for select using (auth.uid() = user_id);
create policy "lern loeschen" on public.lernnotizen for delete using (auth.uid() = user_id);

-- Neue Registrierung -> Konto + erstes Kundenprofil anlegen
create or replace function public.neuer_nutzer()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.accounts (id) values (new.id) on conflict do nothing;
  insert into public.marken (user_id, name) values (new.id, 'Mein Betrieb');
  return new;
end; $$;

drop trigger if exists bei_registrierung on auth.users;
create trigger bei_registrierung after insert on auth.users
for each row execute function public.neuer_nutzer();
