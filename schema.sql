-- ============================================================
-- Top Headlines — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- documents ----------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'other'
    check (category in ('world','technology','business','science','culture','politics','other')),
  keywords text[] not null default '{}',
  file_url text not null,
  file_path text not null,
  thumbnail_url text,
  file_size bigint not null default 0,
  downloads integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_created_at_idx on public.documents (created_at desc);
create index if not exists documents_downloads_idx on public.documents (downloads desc);
create index if not exists documents_category_idx on public.documents (category);
create index if not exists documents_published_idx on public.documents (published);
-- Full text search across title/description/keywords
alter table public.documents
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(keywords, '{}'), ' ')), 'C')
  ) stored;
create index if not exists documents_search_idx on public.documents using gin (search_vector);

-- ---------- downloads (event log) ----------
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  downloaded_at timestamptz not null default now(),
  user_agent text,
  anon_id text
);

create index if not exists downloads_document_id_idx on public.downloads (document_id);
create index if not exists downloads_downloaded_at_idx on public.downloads (downloaded_at desc);

-- ---------- media (general image library) ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_path text not null,
  file_type text not null,
  file_size bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists media_created_at_idx on public.media (created_at desc);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- Admin write access relies on being an authenticated Supabase user
-- (created via Authentication > Users, see README "Creating the first admin").
-- Anonymous visitors get read-only access to published documents.
-- ============================================================

alter table public.documents enable row level security;
alter table public.downloads enable row level security;
alter table public.media enable row level security;

-- Visitors can read published documents
create policy "Public can read published documents"
  on public.documents for select
  using (published = true);

-- Authenticated admins can read everything (including unpublished drafts)
create policy "Admins can read all documents"
  on public.documents for select
  to authenticated
  using (true);

create policy "Admins can insert documents"
  on public.documents for insert
  to authenticated
  with check (true);

create policy "Admins can update documents"
  on public.documents for update
  to authenticated
  using (true) with check (true);

create policy "Admins can delete documents"
  on public.documents for delete
  to authenticated
  using (true);

-- Downloads: anyone can log a download event, only admins can read the log.
-- Incrementing the counter itself happens through a SECURITY DEFINER
-- function called from the server-side API route (service role), so no
-- public UPDATE policy on documents.downloads is needed.
create policy "Admins can read download events"
  on public.downloads for select
  to authenticated
  using (true);

create policy "Media is readable by admins"
  on public.media for select
  to authenticated
  using (true);

create policy "Admins can insert media"
  on public.media for insert
  to authenticated
  with check (true);

create policy "Admins can delete media"
  on public.media for delete
  to authenticated
  using (true);

-- ============================================================
-- Storage buckets
-- Create these once, then run the policies below.
-- Dashboard: Storage > New bucket
--   - "pdfs"        (public bucket, for document files)
--   - "images"      (public bucket, for thumbnails + media library)
-- Or via SQL:
-- ============================================================

insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Public read of files in both buckets (needed so download/view links work
-- without auth); writes are restricted to authenticated admins.
create policy "Public read pdfs"
  on storage.objects for select
  using (bucket_id = 'pdfs');

create policy "Public read images"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Admins can upload pdfs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'pdfs');

create policy "Admins can upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

create policy "Admins can delete pdfs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'pdfs');

create policy "Admins can delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'images');

-- ============================================================
-- Atomic download counter, callable with the anon key (no auth required),
-- but locked down to only ever increment by 1 on an existing document.
-- ============================================================
create or replace function public.increment_downloads(doc_id uuid)
returns void as $$
begin
  update public.documents
  set downloads = downloads + 1
  where id = doc_id;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_downloads(uuid) to anon, authenticated;
