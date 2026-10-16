-- Zewi App – Datenbankschema
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und ausführen.

-- Firmenprofil + verschlüsselter API-Schlüssel, eine Zeile pro Kunde
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  business_name text not null default '',
  offer text not null default '',
  audience text not null default '',
  tone text not null default '',
  extra_notes text not null default '',
  encrypted_api_key text,
  api_key_last4 text,
  updated_at timestamptz not null default now()
);

-- Ergebnisse der Agenten
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  agent text not null,
  input jsonb not null,
  output jsonb not null,
  model text not null,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

-- Row Level Security: jeder Kunde sieht nur seine eigenen Daten
alter table public.profiles enable row level security;
alter table public.generations enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "generations_select_own" on public.generations;
create policy "generations_select_own" on public.generations
  for select using (auth.uid() = user_id);

drop policy if exists "generations_insert_own" on public.generations;
create policy "generations_insert_own" on public.generations
  for insert with check (auth.uid() = user_id);

drop policy if exists "generations_delete_own" on public.generations;
create policy "generations_delete_own" on public.generations
  for delete using (auth.uid() = user_id);
