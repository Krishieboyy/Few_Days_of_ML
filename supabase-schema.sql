-- ============================================================
-- Dora & Sailorr — Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> Run.
-- ============================================================

-- One row per (profile, day). `data` holds the day's entry as JSON
-- ({ sleepHours, journal, mood, checklist }).
create table if not exists public.entries (
  profile     text        not null,
  date        text        not null,            -- "YYYY-MM-DD"
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (profile, date)
);

-- Row Level Security ----------------------------------------------------------
alter table public.entries enable row level security;

-- NOTE: these policies grant the public/anon key full access. The app's
-- passcode only gates the UI, not the database. This is fine for two trusted
-- friends. For real privacy, replace these with Supabase Auth + per-user
-- policies and remove the open ones below.
drop policy if exists "anon read"   on public.entries;
drop policy if exists "anon insert" on public.entries;
drop policy if exists "anon update" on public.entries;

create policy "anon read"   on public.entries for select using (true);
create policy "anon insert" on public.entries for insert with check (true);
create policy "anon update" on public.entries for update using (true) with check (true);

-- Realtime --------------------------------------------------------------------
-- Lets both users see each other's changes live.
alter publication supabase_realtime add table public.entries;
