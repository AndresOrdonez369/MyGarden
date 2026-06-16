-- ============================================================
--  Jardín compartido · Configuración de la base de datos
--  Pega TODO esto en Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.flowers (
  id          uuid primary key default gen_random_uuid(),
  author      text not null,
  color       text not null,
  shape       text not null,
  message     text not null default '',
  x           numeric not null default 50,
  depth       integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Seguridad: activamos RLS y permitimos leer y plantar flores.
alter table public.flowers enable row level security;

drop policy if exists "leer flores" on public.flowers;
create policy "leer flores"
  on public.flowers for select
  using (true);

drop policy if exists "plantar flores" on public.flowers;
create policy "plantar flores"
  on public.flowers for insert
  with check (char_length(message) <= 200);

-- Actualizaciones en vivo (para que la flor del otro aparezca al instante)
alter publication supabase_realtime add table public.flowers;
