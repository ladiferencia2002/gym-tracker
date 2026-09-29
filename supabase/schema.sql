-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: every statement is guarded with "if not exists" / "or replace".

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per user, holds app-specific settings.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  body_weight_kg numeric not null default 70,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid () = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid () = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid () = id);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

-- ---------------------------------------------------------------------------
-- exercises: every logged workout.
-- ---------------------------------------------------------------------------
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  performed_on date not null,
  duration_minutes integer not null check (duration_minutes > 0),
  distance_km numeric check (distance_km >= 0),
  weight_kg numeric check (weight_kg >= 0),
  reps integer check (reps >= 0),
  sets integer check (sets >= 0),
  calories integer not null default 0 check (calories >= 0),
  notes text,
  source text not null default 'manual' check (source in ('manual', 'strava')),
  external_id text,
  created_at timestamptz not null default now()
);

create index if not exists exercises_user_date_idx on public.exercises (user_id, performed_on desc);

create unique index if not exists exercises_user_external_idx on public.exercises (user_id, external_id)
where
  external_id is not null;

alter table public.exercises enable row level security;

drop policy if exists "exercises_select_own" on public.exercises;
create policy "exercises_select_own" on public.exercises for select using (auth.uid () = user_id);

drop policy if exists "exercises_insert_own" on public.exercises;
create policy "exercises_insert_own" on public.exercises for insert with check (auth.uid () = user_id);

drop policy if exists "exercises_update_own" on public.exercises;
create policy "exercises_update_own" on public.exercises for update using (auth.uid () = user_id);

drop policy if exists "exercises_delete_own" on public.exercises;
create policy "exercises_delete_own" on public.exercises for delete using (auth.uid () = user_id);

-- ---------------------------------------------------------------------------
-- push_subscriptions: Web Push endpoints for daily reminders.
-- ---------------------------------------------------------------------------
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_subscriptions_select_own" on public.push_subscriptions;
create policy "push_subscriptions_select_own" on public.push_subscriptions for select using (auth.uid () = user_id);

drop policy if exists "push_subscriptions_insert_own" on public.push_subscriptions;
create policy "push_subscriptions_insert_own" on public.push_subscriptions for insert with check (auth.uid () = user_id);

drop policy if exists "push_subscriptions_delete_own" on public.push_subscriptions;
create policy "push_subscriptions_delete_own" on public.push_subscriptions for delete using (auth.uid () = user_id);

-- ---------------------------------------------------------------------------
-- strava_connections: OAuth tokens for the Strava integration.
-- Only ever read/written server-side; never exposed to the browser.
-- ---------------------------------------------------------------------------
create table if not exists public.strava_connections (
  user_id uuid primary key references auth.users (id) on delete cascade,
  athlete_id bigint,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.strava_connections enable row level security;

drop policy if exists "strava_connections_all_own" on public.strava_connections;
create policy "strava_connections_all_own" on public.strava_connections for all using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);
