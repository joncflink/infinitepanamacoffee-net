-- Infinite Coffee Passport(TM) - initial schema
-- Tables: profiles, coffees, passports, cellar_items, qr_scan_events,
-- reorder_events, reservations. RLS enabled on all tables. Seed data for
-- the Altura lot at the bottom.

-- ============================================================
-- 1. profiles - member accounts
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  member_number text unique,
  country text,
  phone text,
  whatsapp text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create sequence if not exists member_number_seq start 1;

create or replace function generate_member_number()
returns trigger as $$
begin
  if new.member_number is null then
    new.member_number := 'IPC-MEMBER-' || lpad(nextval('member_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_member_number
  before insert on profiles
  for each row execute function generate_member_number();

-- Auto-create a profile row whenever a new Supabase Auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. coffees - lot records
-- ============================================================

create table coffees (
  id uuid primary key default gen_random_uuid(),
  lot_id text unique not null,
  display_lot_id text,
  collection text not null,
  coffee_name text not null,
  product_type text,
  origin text,
  region text,
  farm text,
  producer text,
  exporter text,
  elevation text,
  process text,
  variety text,
  harvest text,
  status text default 'reserve_collection'
    check (status in (
      'available', 'reserve_collection', 'limited_release',
      'private_allocation', 'currently_resting', 'sold_out', 'archived'
    )),
  story text,
  founder_notes text,
  storage text,
  amazon_url text,
  amazon_asin text,
  sku text,
  qr_code_path text,
  certificate_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 3. passports - one canonical passport per lot
-- ============================================================

create table passports (
  id uuid primary key default gen_random_uuid(),
  passport_number text unique not null,
  display_passport_number text,
  coffee_id uuid references coffees(id) on delete cascade,
  lot_id text,
  status text default 'active'
    check (status in ('active', 'verified', 'archived', 'retired')),
  registry_edition text default 'Registry Edition 1.0',
  issued_at timestamptz default now(),
  last_verified_at timestamptz,
  qr_code_url text,
  certificate_url text,
  verification_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 4. reservations - public "Reserve This Allocation" / "Join Next
--    Harvest List" submissions. No account required to submit.
-- ============================================================

create table reservations (
  id uuid primary key default gen_random_uuid(),
  coffee_id uuid references coffees(id),
  passport_id uuid references passports(id),
  lot_id text,
  size text,
  full_name text,
  email text,
  phone text,
  whatsapp text,
  country text,
  notes text,
  status text default 'new'
    check (status in (
      'new', 'reviewed', 'contacted', 'reserved', 'fulfilled', 'cancelled'
    )),
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 5. cellar_items - a member's saved / purchased coffees
-- ============================================================

create table cellar_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  coffee_id uuid references coffees(id),
  passport_id uuid references passports(id),
  lot_id text,
  ownership_status text default 'saved'
    check (ownership_status in (
      'saved', 'reserved', 'purchased', 'reordered', 'archived'
    )),
  purchase_source text,
  amazon_order_id text,
  rating integer check (rating between 1 and 5),
  customer_notes text,
  favorite boolean default false,
  added_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 6. qr_scan_events - product analytics only, no invasive data
-- ============================================================

create table qr_scan_events (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid references passports(id),
  coffee_id uuid references coffees(id),
  lot_id text,
  scanned_at timestamptz default now(),
  referrer text,
  user_agent text,
  device_type text,
  country text,
  source text
);

-- ============================================================
-- 7. reorder_events - CTA click tracking
-- ============================================================

create table reorder_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  coffee_id uuid references coffees(id),
  passport_id uuid references passports(id),
  lot_id text,
  action text
    check (action in (
      'reserve_clicked', 'reorder_clicked',
      'join_next_harvest_clicked', 'amazon_clicked'
    )),
  destination_url text,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. updated_at auto-touch trigger, shared across tables
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger touch_profiles before update on profiles
  for each row execute function set_updated_at();
create trigger touch_coffees before update on coffees
  for each row execute function set_updated_at();
create trigger touch_passports before update on passports
  for each row execute function set_updated_at();
create trigger touch_reservations before update on reservations
  for each row execute function set_updated_at();
create trigger touch_cellar_items before update on cellar_items
  for each row execute function set_updated_at();

-- ============================================================
-- 9. Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table coffees enable row level security;
alter table passports enable row level security;
alter table reservations enable row level security;
alter table cellar_items enable row level security;
alter table qr_scan_events enable row level security;
alter table reorder_events enable row level security;

-- coffees: public read, admin write only (no anon/authenticated write
-- policy - writes only happen via the service-role client)
create policy "coffees are publicly readable"
  on coffees for select
  using (true);

-- passports: public read, admin write only
create policy "passports are publicly readable"
  on passports for select
  using (true);

-- reservations: public insert, admin read/write (no select policy for
-- anon/authenticated - admin reads happen via the service-role client)
create policy "anyone can submit a reservation"
  on reservations for insert
  with check (true);

-- profiles: users manage only their own profile
create policy "users can view their own profile"
  on profiles for select
  using (auth.uid() = id);
create policy "users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- cellar_items: users manage only their own cellar
create policy "users can view their own cellar items"
  on cellar_items for select
  using (auth.uid() = user_id);
create policy "users can add their own cellar items"
  on cellar_items for insert
  with check (auth.uid() = user_id);
create policy "users can update their own cellar items"
  on cellar_items for update
  using (auth.uid() = user_id);
create policy "users can delete their own cellar items"
  on cellar_items for delete
  using (auth.uid() = user_id);

-- qr_scan_events: public insert allowed, public read denied
create policy "anyone can log a qr scan event"
  on qr_scan_events for insert
  with check (true);

-- reorder_events: public insert allowed, public read denied
create policy "anyone can log a reorder event"
  on reorder_events for insert
  with check (true);

-- ============================================================
-- 10. Seed data - Infinite Select(TM) Altura, lot IPC-ALT-001
-- ============================================================

insert into coffees (
  lot_id,
  display_lot_id,
  collection,
  coffee_name,
  product_type,
  origin,
  region,
  farm,
  producer,
  exporter,
  elevation,
  process,
  variety,
  harvest,
  status,
  story,
  founder_notes,
  storage,
  amazon_url,
  amazon_asin,
  sku,
  qr_code_path
) values (
  'IPC-ALT-001',
  'IPC•2025•ALT•001',
  'Infinite Select™',
  'Altura',
  'Specialty Green Coffee Beans',
  'Boquete, Chiriquí, Panama',
  'Boquete',
  'Pending Producer Confirmation',
  'Pending Producer Confirmation',
  'Ruiz Specialty Coffee',
  'Pending Producer Confirmation',
  'Washed',
  'Pending Producer Confirmation',
  '2025–2026',
  'reserve_collection',
  'Selected from the highlands of Boquete, this washed Altura lot represents the clean, balanced character of Panama specialty green coffee.',
  'I selected this coffee because it represents the kind of long-term sourcing Infinite Panama Coffee was created to support: patient, traceable, and rooted in place. This lot is intentionally limited. It is not meant to be everything to everyone. It is meant to be worthy of the Infinite name.',
  'Store in a cool, dry place. Protect from heat, moisture, and direct sunlight.',
  null,
  null,
  'IPC-ALT-8OZ-001',
  '/qr/IPC-ALT-001.svg'
);

insert into passports (
  passport_number,
  display_passport_number,
  coffee_id,
  lot_id,
  status,
  registry_edition,
  qr_code_url
)
select
  'IPC-ALT-001',
  'IPC•2025•ALT•001',
  id,
  'IPC-ALT-001',
  'verified',
  'Registry Edition 1.0',
  'https://infinitepanamacoffee.com/passport/IPC-ALT-001'
from coffees
where lot_id = 'IPC-ALT-001';
