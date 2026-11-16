-- Optional standalone `experiments` table migration for Supabase
-- Note: The application also persists experiments and tinkering items inside
-- `site_settings.about_text` automatically so the CMS works out-of-the-box.

create table if not exists public.experiments (
    id text primary key,
    title text not null,
    slug text not null unique,
    short_description text not null default '',
    full_story text default '',
    cover_image text default '',
    gallery jsonb default '[]'::jsonb,
    category text not null default 'Product Experiments',
    status text not null default 'In Progress',
    technologies jsonb default '[]'::jsonb,
    year text default '2026',
    color text default '#F7095E',
    featured boolean default false,
    published boolean default true,
    live_url text default '',
    github_url text default '',
    github_metadata jsonb,
    content_blocks jsonb default '[]'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.experiments enable row level security;

create policy "Public can read published experiments"
    on public.experiments
    for select
    using (published = true or auth.role() = 'authenticated');

create policy "Authenticated users can manage experiments"
    on public.experiments
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
