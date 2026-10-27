-- Migration: Add instagram_handle and linkedin_url to member_applications and profiles table

ALTER TABLE public.member_applications
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Also update public.profiles if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
    END IF;
END $$;

COMMENT ON COLUMN public.member_applications.instagram_handle IS 'Mandatory Instagram handle or profile link provided by the applicant.';
COMMENT ON COLUMN public.member_applications.linkedin_url IS 'Optional LinkedIn profile link provided by the applicant.';
