-- First, drop any existing triggers that might be creating default entries
DROP TRIGGER IF EXISTS create_default_entry ON auth.users;
DROP FUNCTION IF EXISTS public.create_default_journal_entry();

-- Remove any default entries (checking all variations)
DELETE FROM public.journal_entries
WHERE (content = 'today was a good day' OR content LIKE '%good day%')
AND mood IN ('happy', 'neutral', 'sad');

-- Drop any existing function that might be creating default entries
DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;

-- Create a clean version of the function if needed
CREATE OR REPLACE FUNCTION auth.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN NEW;
END;
$$;

-- Let's also check for any other triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; 