-- Doctor Animal Auto Tune - Supabase schema
-- Run this in the Supabase SQL editor.
-- After creating your first admin auth user, run:
-- update public.profiles set role = 'admin' where email = 'admin@doctoranimal.co.ke';

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('client', 'admin', 'staff');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.booking_status as enum ('pending', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.job_status as enum ('pending', 'scheduled', 'in_progress', 'complete', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'processing', 'ready', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.invoice_status as enum ('draft', 'open', 'paid', 'void');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.lead_status as enum ('new', 'contacted', 'converted', 'closed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.feedback_status as enum ('new', 'reviewed', 'resolved');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.product_type as enum ('part', 'car');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  phone text,
  role public.app_role not null default 'client',
  member_since date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'Client'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  slug text not null unique,
  description text,
  icon_class text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  make text not null,
  model text not null,
  year integer,
  plate text,
  vin text,
  mileage_km integer,
  color text,
  last_service_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_type public.product_type not null default 'part',
  name text not null,
  category text not null,
  make text,
  part_no text,
  description text,
  price numeric(12,2) not null default 0 check (price >= 0),
  stock_qty integer not null default 0 check (stock_qty >= 0),
  image_url text,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_no text unique not null default ('BK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  client_id uuid references public.profiles(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  vehicle_label text,
  service_name text not null,
  preferred_date date,
  notes text,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  role_title text,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repair_jobs (
  id uuid primary key default gen_random_uuid(),
  job_no text unique not null default ('JOB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  booking_id uuid references public.bookings(id) on delete set null,
  client_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  service_name text not null,
  status public.job_status not null default 'pending',
  status_label text not null default 'Awaiting Approval',
  progress integer not null default 0 check (progress between 0 and 100),
  booked_date date,
  estimated_completion text,
  technician_id uuid references public.staff(id) on delete set null,
  technician_name text,
  bay text,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repair_timeline_steps (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.repair_jobs(id) on delete cascade,
  title text not null,
  description text,
  event_at timestamptz,
  is_done boolean not null default false,
  is_current boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repair_reports (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.repair_jobs(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  title text not null,
  body text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.repair_jobs(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  sender_role text not null check (sender_role in ('client', 'workshop', 'admin')),
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no text unique not null default ('INV-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  job_id uuid references public.repair_jobs(id) on delete set null,
  client_id uuid not null references public.profiles(id) on delete cascade,
  status public.invoice_status not null default 'draft',
  status_label text not null default 'Draft',
  issued_at date,
  due_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  item_type text not null check (item_type in ('service', 'part', 'other')),
  description text not null,
  qty numeric(10,2) not null default 1 check (qty > 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  is_added boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null default ('ORD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  client_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  status public.order_status not null default 'pending',
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  qty integer not null default 1 check (qty > 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete set null,
  name text,
  email text,
  rating integer not null check (rating between 1 and 5),
  message text not null,
  channel text not null default 'Feedback page',
  status public.feedback_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  vehicle_or_service text,
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace view public.invoice_totals
with (security_invoker = true) as
select
  i.id as invoice_id,
  i.client_id,
  coalesce(sum(ii.qty * ii.unit_price) filter (where ii.is_added), 0)::numeric(12,2) as subtotal,
  round(coalesce(sum(ii.qty * ii.unit_price) filter (where ii.is_added), 0) * 0.16, 2)::numeric(12,2) as vat,
  round(coalesce(sum(ii.qty * ii.unit_price) filter (where ii.is_added), 0) * 1.16, 2)::numeric(12,2) as total
from public.invoices i
left join public.invoice_items ii on ii.invoice_id = i.id
group by i.id, i.client_id;

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_vehicles_client on public.vehicles(client_id);
create index if not exists idx_products_visible on public.products(visible);
create index if not exists idx_bookings_client_status on public.bookings(client_id, status);
create index if not exists idx_jobs_client_status on public.repair_jobs(client_id, status);
create index if not exists idx_timeline_job on public.repair_timeline_steps(job_id, sort_order);
create index if not exists idx_reports_job on public.repair_reports(job_id, published_at desc);
create index if not exists idx_messages_client_created on public.messages(client_id, created_at desc);
create index if not exists idx_invoices_client on public.invoices(client_id);
create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);
create index if not exists idx_orders_client_status on public.orders(client_id, status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_feedback_status on public.feedback(status);
create index if not exists idx_contact_status on public.contact_messages(status);

do $$ declare
  t text;
begin
  foreach t in array array[
    'profiles','services','vehicles','products','bookings','staff','repair_jobs',
    'repair_timeline_steps','repair_reports','messages','invoices','invoice_items',
    'orders','order_items','feedback','contact_messages','site_settings'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', t, t);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.vehicles enable row level security;
alter table public.products enable row level security;
alter table public.bookings enable row level security;
alter table public.staff enable row level security;
alter table public.repair_jobs enable row level security;
alter table public.repair_timeline_steps enable row level security;
alter table public.repair_reports enable row level security;
alter table public.messages enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.feedback enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- Profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (id = auth.uid());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
for update using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- Public catalog and service pages
drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
for select using (is_active or public.is_admin());

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
for select using (visible or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
for all using (public.is_admin()) with check (public.is_admin());

-- Client-owned records
drop policy if exists "vehicles_client_or_admin" on public.vehicles;
create policy "vehicles_client_or_admin" on public.vehicles
for all using (client_id = auth.uid() or public.is_admin())
with check (client_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_insert_public" on public.bookings;
create policy "bookings_insert_public" on public.bookings
for insert with check (true);

drop policy if exists "bookings_select_client_or_admin" on public.bookings;
create policy "bookings_select_client_or_admin" on public.bookings
for select using (client_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_admin_update" on public.bookings;
create policy "bookings_admin_update" on public.bookings
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "staff_admin_all" on public.staff;
create policy "staff_admin_all" on public.staff
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "jobs_client_read_admin_all" on public.repair_jobs;
create policy "jobs_client_read_admin_all" on public.repair_jobs
for select using (client_id = auth.uid() or public.is_admin());

drop policy if exists "jobs_admin_write" on public.repair_jobs;
create policy "jobs_admin_write" on public.repair_jobs
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "timeline_client_read_admin_all" on public.repair_timeline_steps;
create policy "timeline_client_read_admin_all" on public.repair_timeline_steps
for select using (
  public.is_admin()
  or exists (
    select 1 from public.repair_jobs j
    where j.id = repair_timeline_steps.job_id and j.client_id = auth.uid()
  )
);

drop policy if exists "timeline_admin_write" on public.repair_timeline_steps;
create policy "timeline_admin_write" on public.repair_timeline_steps
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports_client_read_admin_all" on public.repair_reports;
create policy "reports_client_read_admin_all" on public.repair_reports
for select using (
  public.is_admin()
  or exists (
    select 1 from public.repair_jobs j
    where j.id = repair_reports.job_id and j.client_id = auth.uid()
  )
);

drop policy if exists "reports_admin_write" on public.repair_reports;
create policy "reports_admin_write" on public.repair_reports
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages_client_or_admin_read" on public.messages;
create policy "messages_client_or_admin_read" on public.messages
for select using (client_id = auth.uid() or public.is_admin());

drop policy if exists "messages_client_or_admin_insert" on public.messages;
create policy "messages_client_or_admin_insert" on public.messages
for insert with check (client_id = auth.uid() or public.is_admin());

drop policy if exists "messages_admin_or_sender_update" on public.messages;
create policy "messages_admin_or_sender_update" on public.messages
for update using (sender_id = auth.uid() or client_id = auth.uid() or public.is_admin())
with check (sender_id = auth.uid() or client_id = auth.uid() or public.is_admin());

drop policy if exists "invoices_client_read_admin_all" on public.invoices;
create policy "invoices_client_read_admin_all" on public.invoices
for select using (client_id = auth.uid() or public.is_admin());

drop policy if exists "invoices_admin_write" on public.invoices;
create policy "invoices_admin_write" on public.invoices
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "invoice_items_client_read_admin_all" on public.invoice_items;
create policy "invoice_items_client_read_admin_all" on public.invoice_items
for select using (
  public.is_admin()
  or exists (
    select 1 from public.invoices i
    where i.id = invoice_items.invoice_id and i.client_id = auth.uid()
  )
);

drop policy if exists "invoice_items_admin_write" on public.invoice_items;
create policy "invoice_items_admin_write" on public.invoice_items
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders_client_or_admin" on public.orders;
create policy "orders_client_or_admin" on public.orders
for all using (client_id = auth.uid() or public.is_admin())
with check (client_id = auth.uid() or public.is_admin() or client_id is null);

drop policy if exists "order_items_client_read_admin_all" on public.order_items;
create policy "order_items_client_read_admin_all" on public.order_items
for select using (
  public.is_admin()
  or exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.client_id = auth.uid()
  )
);

drop policy if exists "order_items_insert_for_order_owner" on public.order_items;
create policy "order_items_insert_for_order_owner" on public.order_items
for insert with check (
  public.is_admin()
  or exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and (o.client_id = auth.uid() or o.client_id is null)
  )
);

drop policy if exists "order_items_admin_update" on public.order_items;
create policy "order_items_admin_update" on public.order_items
for update using (public.is_admin()) with check (public.is_admin());

-- Public submissions
drop policy if exists "feedback_insert_public" on public.feedback;
create policy "feedback_insert_public" on public.feedback
for insert with check (true);

drop policy if exists "feedback_select_own_or_admin" on public.feedback;
create policy "feedback_select_own_or_admin" on public.feedback
for select using (client_id = auth.uid() or public.is_admin());

drop policy if exists "feedback_admin_update" on public.feedback;
create policy "feedback_admin_update" on public.feedback
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contact_insert_public" on public.contact_messages;
create policy "contact_insert_public" on public.contact_messages
for insert with check (true);

drop policy if exists "contact_admin_read" on public.contact_messages;
create policy "contact_admin_read" on public.contact_messages
for select using (public.is_admin());

drop policy if exists "contact_admin_update" on public.contact_messages;
create policy "contact_admin_update" on public.contact_messages
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
for select using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
for all using (public.is_admin()) with check (public.is_admin());

-- Starter rows for the current frontend catalog and service menus.
insert into public.services (title, slug, description, icon_class, sort_order)
values
  ('Engine Repair', 'engine-repair', 'Full engine diagnostics, overhaul, and repair.', 'fa-solid fa-gears', 10),
  ('Electrical Systems', 'electrical-systems', 'Battery, alternator, wiring and ECU diagnostics.', 'fa-solid fa-car-battery', 20),
  ('AC Service', 'ac-service', 'Climate control service, leak detection and recharge.', 'fa-solid fa-snowflake', 30),
  ('OBD Diagnostics', 'obd-diagnostics', 'Computer scan and detailed fault report.', 'fa-solid fa-laptop-medical', 40),
  ('Brake Service', 'brake-service', 'Disc, pad, fluid and ABS troubleshooting.', 'fa-solid fa-oil-can', 50),
  ('Transmission', 'transmission', 'Automatic and manual gearbox repair and servicing.', 'fa-solid fa-gauge-high', 60),
  ('Suspension & Steering', 'suspension-steering', 'Shock, strut, bushing and power steering repair.', 'fa-solid fa-road', 70),
  ('General Maintenance', 'general-maintenance', 'Oil change, filters, fluids and scheduled service.', 'fa-solid fa-wrench', 80)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon_class = excluded.icon_class,
  sort_order = excluded.sort_order;

insert into public.products (product_type, name, category, make, part_no, description, price, stock_qty, image_url, visible)
values
  ('part', 'MANN Oil Filter HU 816 X', 'filters', 'MANN-FILTER', 'HU 816 X', 'OEM-grade cartridge oil filter for selected BMW and Mini petrol engines.', 1850, 12, 'parts/MANN Oil Filter HU 816 X.webp', true),
  ('part', 'Bosch Platinum Spark Plug Set', 'engine', 'Bosch', '0242236563 / FR7NPP332', 'Platinum plug set for Mercedes-Benz and BMW petrol engines.', 6200, 10, 'parts/Bosch Platinum Spark Plug Set.png', true),
  ('part', 'Continental Timing Belt Kit', 'engine', 'Continental ContiTech', 'CT1168K1', 'Complete belt kit for selected Ford EcoBoost engines.', 18500, 6, 'parts/Continental Timing Belt Kit.webp', true),
  ('part', 'ATE Front Brake Disc Pair', 'brakes', 'ATE', '24.0128-0158.1', 'Vented front brake discs for Mercedes-Benz C-Class applications.', 14200, 8, 'parts/ATE Front Brake Disc Pair.webp', true),
  ('part', 'Textar Ceramic Brake Pads', 'brakes', 'Textar', '2372301', 'Low-dust front pads for BMW 3 Series and 4 Series models.', 9800, 9, 'parts/Textar Ceramic Brake Pads.webp', true),
  ('part', 'MAHLE Air Filter LX 1566', 'filters', 'MAHLE', 'LX 1566', 'High-flow panel air filter for Volvo Drive-E and selected Ford engines.', 3200, 15, 'parts/MAHLE Air Filter LX 1566.webp', true),
  ('part', 'Valeo Alternator 150A', 'electrical', 'Valeo', '439658', 'Remanufactured alternator for Volvo and Ford 2.0 applications.', 28500, 4, 'parts/Valeo Alternator 150A.webp', true),
  ('part', 'Varta AGM Battery 70Ah', 'electrical', 'Varta', 'E39 570 901 076', 'AGM battery for start-stop Mercedes, BMW, Volvo and Ford vehicles.', 24500, 5, 'parts/Varta AGM Battery 70Ah.webp', true),
  ('car', 'BMW 320i', 'Luxury Sedan', 'BMW', null, 'Premium European sedan service package with factory-standard care for BMW engines and suspension.', 4250000, 1, 'cars/BMW 320i.webp', true),
  ('car', 'Mercedes-Benz C-Class', 'Luxury Sedan', 'Mercedes-Benz', null, 'Comprehensive maintenance for Mercedes-Benz with genuine parts and precise diagnostics.', 4450000, 1, 'cars/Mercedes-Benz C-Class.webp', true),
  ('car', 'Volvo XC60', 'Luxury SUV', 'Volvo', null, 'Complete SUV service tailored for Volvo safety systems, brakes, and suspension.', 4700000, 1, 'cars/Volvo XC60.webp', true),
  ('car', 'Ford Ranger', 'Pickup Truck', 'Ford', null, 'Durable pickup maintenance and drivetrain inspection for Ford Ranger reliability.', 3850000, 1, 'cars/Ford Ranger.webp', true)
on conflict do nothing;

insert into public.site_settings (key, value)
values
  ('business', '{"name":"Doctor Animal Auto Tune","phone":"+254720862971","whatsapp":"+254735548605","email":"hello@doctoranimal.co.ke","location":"Corner, Kamakis, Kiambu County, Kenya","hours":"Mon - Sat: 8am - 6pm"}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

grant usage on schema public to anon, authenticated;

grant select on public.services, public.products, public.site_settings to anon, authenticated;
grant insert on public.bookings, public.feedback, public.contact_messages to anon, authenticated;

grant select, insert, update on
  public.profiles,
  public.vehicles,
  public.bookings,
  public.repair_jobs,
  public.repair_timeline_steps,
  public.repair_reports,
  public.messages,
  public.invoices,
  public.invoice_items,
  public.orders,
  public.order_items,
  public.feedback,
  public.contact_messages,
  public.staff,
  public.services,
  public.products,
  public.site_settings
to authenticated;

grant select on public.invoice_totals to authenticated;

grant execute on function public.is_admin() to authenticated;
