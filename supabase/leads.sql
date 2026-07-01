create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  contact text,
  vehicle text not null,
  service_interest text,
  notes text,
  page text,
  source text not null default 'website',
  submitted_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_submitted_at_idx on public.leads (submitted_at desc);
create index if not exists leads_phone_idx on public.leads (phone);
create index if not exists leads_email_idx on public.leads (email);

alter table public.leads enable row level security;

drop policy if exists "Service role can manage leads" on public.leads;
create policy "Service role can manage leads"
  on public.leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
