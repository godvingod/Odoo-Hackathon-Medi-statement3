-- Auto-create profiles when users sign up
-- Run this script in your Supabase SQL editor

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email, points, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    0,
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger that calls the function when a new user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 