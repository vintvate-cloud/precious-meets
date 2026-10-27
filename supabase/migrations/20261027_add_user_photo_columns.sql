-- Migration: Add user_photo_url and user_photo_name to member_applications table
-- Allows storing both the member's government Aadhaar document and their personal selfie/portrait photo

ALTER TABLE public.member_applications
ADD COLUMN IF NOT EXISTS user_photo_url TEXT,
ADD COLUMN IF NOT EXISTS user_photo_name TEXT;

-- Ensure avatar_url exists as standard profile image column
ALTER TABLE public.member_applications
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Also update public.profiles if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_photo_url TEXT;
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_photo_name TEXT;
    END IF;
END $$;

COMMENT ON COLUMN public.member_applications.user_photo_url IS 'Applicant personal self-portrait photo used for table curation and identity cross-verification against Aadhaar ID.';
COMMENT ON COLUMN public.member_applications.user_photo_name IS 'Original file name of the uploaded personal photo.';
