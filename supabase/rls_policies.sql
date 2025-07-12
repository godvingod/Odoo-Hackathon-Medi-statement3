-- RLS Policies for ReWear Database
-- Run this script in your Supabase SQL editor to fix the "violates row-level security policy" error

-- Enable Row Level Security on all tables
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

-- RLS Policies for profiles table
-- Allow users to view their own profile
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Allow users to insert their own profile (for new users)
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

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

-- RLS Policies for admin_actions table
-- Allow all authenticated users to view admin actions (for now)
create policy "Users can view admin actions" on admin_actions
  for select using (auth.uid() is not null);

-- Allow all authenticated users to insert admin actions (for now)
create policy "Users can insert admin actions" on admin_actions
  for insert with check (auth.uid() is not null);

-- Create indexes for better performance
create index if not exists idx_items_uploader_id on items(uploader_id);
create index if not exists idx_items_status on items(status);
create index if not exists idx_items_category on items(category);
create index if not exists idx_swaps_requester_id on swaps(requester_id);
create index if not exists idx_swaps_responder_id on swaps(responder_id);
create index if not exists idx_swaps_item_id on swaps(item_id); 