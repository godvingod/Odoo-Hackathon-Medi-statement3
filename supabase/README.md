# Supabase Setup for ReWear

1. **Create a Supabase project** at https://app.supabase.io
2. **Create tables** using `schema.sql` in this folder.
3. **Enable Storage**: Create a bucket called `item-images` and make it public.
4. **Add RLS policies** for security by running `rls_policies.sql` in your Supabase SQL editor.

## Fixing the "violates row-level security policy" Error

If you're getting a "new row violates row-level security policy for table 'items'" error when adding items, follow these steps:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `rls_policies.sql` into the editor
4. Click "Run" to execute the script
5. This will create all the necessary RLS policies to allow users to insert their own items

**Remember:** Add your Supabase URL and anon key to the `.env` file in the project root.