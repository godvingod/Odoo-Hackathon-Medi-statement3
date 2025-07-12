-- Users (managed by Supabase Auth)
-- Additional profile metadata in 'profiles'
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  email text unique,
  avatar_url text,
  points int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  is_admin boolean default false
);

-- Clothing Items
create table items (
  id uuid primary key default uuid_generate_v4(),
  uploader_id uuid references profiles(id),
  title text not null,
  description text,
  category text,
  type text,
  size text,
  condition text,
  tags text[],
  images text[], -- URLs to Supabase Storage
  status text default 'available', -- available, swapped, removed
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Swaps (direct or via points)
create table swaps (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid references profiles(id),
  responder_id uuid references profiles(id),
  item_id uuid references items(id),
  type text, -- 'swap' or 'points'
  status text default 'pending', -- pending, accepted, completed, rejected
  points int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Admin Actions (audit log)
create table admin_actions (
  id serial primary key,
  admin_id uuid references profiles(id),
  action text,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table items enable row level security;
alter table profiles enable row level security;
alter table swaps enable row level security;
alter table admin_actions enable row level security;

-- RLS Policies for items table
-- Allow users to view all available items
create policy "Users can view available items" on items
  for select using (status = 'available');

-- Allow users to view their own items (regardless of status)
create policy "Users can view their own items" on items
  for select using (auth.uid() = uploader_id);

-- Allow users to insert their own items
create policy "Users can insert their own items" on items
  for insert with check (auth.uid() = uploader_id);

-- Allow users to update their own items
create policy "Users can update their own items" on items
  for update using (auth.uid() = uploader_id);

-- Allow users to delete their own items
create policy "Users can delete their own items" on items
  for delete using (auth.uid() = uploader_id);

-- Allow admins to view all items
create policy "Admins can view all items" on items
  for select using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Allow admins to update all items
create policy "Admins can update all items" on items
  for update using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- RLS Policies for profiles table
-- Allow users to view their own profile
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Allow admins to view all profiles
create policy "Admins can view all profiles" on profiles
  for select using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Allow admins to update all profiles
create policy "Admins can update all profiles" on profiles
  for update using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Allow admins to delete profiles
create policy "Admins can delete profiles" on profiles
  for delete using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- RLS Policies for swaps table
-- Allow users to view swaps they're involved in
create policy "Users can view their swaps" on swaps
  for select using (auth.uid() = requester_id or auth.uid() = responder_id);

-- Allow users to insert swap requests
create policy "Users can insert swap requests" on swaps
  for insert with check (auth.uid() = requester_id);

-- Allow users to update swaps they're involved in
create policy "Users can update their swaps" on swaps
  for update using (auth.uid() = requester_id or auth.uid() = responder_id);

-- Allow admins to view all swaps
create policy "Admins can view all swaps" on swaps
  for select using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- RLS Policies for admin_actions table
-- Allow admins to view all admin actions
create policy "Admins can view admin actions" on admin_actions
  for select using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Allow admins to insert admin actions
create policy "Admins can insert admin actions" on admin_actions
  for insert with check (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Indexes for better performance
create index idx_items_uploader_id on items(uploader_id);
create index idx_items_status on items(status);
create index idx_items_category on items(category);
create index idx_swaps_requester_id on swaps(requester_id);
create index idx_swaps_responder_id on swaps(responder_id);
create index idx_swaps_item_id on swaps(item_id);