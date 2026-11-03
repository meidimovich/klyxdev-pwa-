create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null,
  content jsonb not null default '{}'::jsonb,
  cover_image text,
  is_published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  contact text not null check (char_length(contact) between 1 and 240),
  project_type text not null default '',
  budget text not null default '',
  details text not null check (char_length(details) between 1 and 5000),
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  content jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  content jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.is_klyxdev_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.applications enable row level security;
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admins can read their own role" on public.admin_users;
create policy "Admins can read their own role"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Published projects are public" on public.projects;
create policy "Published projects are public"
  on public.projects for select to anon, authenticated
  using (is_published or public.is_klyxdev_admin());

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
  on public.projects for all to authenticated
  using (public.is_klyxdev_admin())
  with check (public.is_klyxdev_admin());

drop policy if exists "Visitors can submit applications" on public.applications;
create policy "Visitors can submit applications"
  on public.applications for insert to anon, authenticated
  with check (
    status = 'new'
    and char_length(trim(name)) between 1 and 120
    and char_length(trim(contact)) between 1 and 240
    and char_length(trim(details)) between 1 and 5000
  );

drop policy if exists "Admins manage applications" on public.applications;
create policy "Admins manage applications"
  on public.applications for all to authenticated
  using (public.is_klyxdev_admin())
  with check (public.is_klyxdev_admin());

drop policy if exists "Published services are public" on public.services;
create policy "Published services are public"
  on public.services for select to anon, authenticated
  using (is_published or public.is_klyxdev_admin());

drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services"
  on public.services for all to authenticated
  using (public.is_klyxdev_admin())
  with check (public.is_klyxdev_admin());

drop policy if exists "Published team members are public" on public.team_members;
create policy "Published team members are public"
  on public.team_members for select to anon, authenticated
  using (is_published or public.is_klyxdev_admin());

drop policy if exists "Admins manage team members" on public.team_members;
create policy "Admins manage team members"
  on public.team_members for all to authenticated
  using (public.is_klyxdev_admin())
  with check (public.is_klyxdev_admin());

drop policy if exists "Public settings can be read" on public.site_settings;
create policy "Public settings can be read"
  on public.site_settings for select to anon, authenticated
  using (key = 'public');

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
  on public.site_settings for all to authenticated
  using (public.is_klyxdev_admin())
  with check (public.is_klyxdev_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

drop policy if exists "Public reads project images" on storage.objects;
create policy "Public reads project images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Admins manage project images" on storage.objects;
create policy "Admins manage project images"
  on storage.objects for all to authenticated
  using (bucket_id = 'project-images' and public.is_klyxdev_admin())
  with check (bucket_id = 'project-images' and public.is_klyxdev_admin());

insert into public.site_settings (key, content)
values ('public', '{"email":"hello@klyxdev.dev","telegram":"@klyxdev"}'::jsonb)
on conflict (key) do nothing;
