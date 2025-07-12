-- Make a user an admin
-- Replace 'your-email@example.com' with your actual email address
-- Run this script in your Supabase SQL editor

-- Option 1: Make admin by email (replace with your email)
update profiles 
set is_admin = true 
where email = 'your-email@example.com';

-- Option 2: Make admin by user ID (replace with your user ID)
-- You can find your user ID in the browser console or from the debug panel
-- update profiles 
-- set is_admin = true 
-- where id = 'your-user-id-here';

-- Option 3: Make the first user an admin (if you're the only user)
-- update profiles 
-- set is_admin = true 
-- where id = (select id from profiles order by created_at limit 1);

-- Verify the change
select id, email, username, is_admin from profiles where is_admin = true; 