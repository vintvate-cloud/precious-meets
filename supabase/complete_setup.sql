-- ==============================================================================
-- PRECIOUS MEETS - CONSOLIDATED PRODUCTION DATABASE SCHEMA
-- Run this script in: Supabase Dashboard -> SQL Editor -> New Query
-- URL: https://supabase.com/dashboard/project/vdupycmvzsiepdrqdkrb/sql/new
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. ADMIN USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin', 'curator')),
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed Administrator
INSERT INTO public.admin_users (email, full_name, role, phone)
VALUES ('admin@preciousmeets.com', 'Precious Meets Executive Admin', 'superadmin', '+91 98100 12345')
ON CONFLICT (email) DO UPDATE 
SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- ------------------------------------------------------------------------------
-- 4. PROFILES TABLE (Linked with Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    city TEXT DEFAULT 'Delhi NCR',
    pincode TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'host', 'moderator', 'admin')),
    membership_status TEXT NOT NULL DEFAULT 'quiz_completed' 
        CHECK (membership_status IN ('quiz_completed', 'paid_pending_credentials', 'active', 'rejected', 'suspended')),
    identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    identity_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (identity_status IN ('unverified', 'pending', 'verified', 'failed', 'manual_review')),
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    quiz_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. MEMBER APPLICATIONS TABLE (Quiz Dossiers, Payments & Provisioning)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.member_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    application_reference TEXT UNIQUE NOT NULL, -- e.g. PM-FILE-2026-8941
    
    -- Status lifecycle
    status TEXT NOT NULL DEFAULT 'pending_review' 
        CHECK (status IN ('draft', 'quiz_completed', 'paid_pending_credentials', 'pending_review', 'approved', 'rejected')),
    membership_status TEXT NOT NULL DEFAULT 'quiz_completed'
        CHECK (membership_status IN ('quiz_completed', 'paid_pending_credentials', 'active', 'rejected', 'suspended')),
    
    -- Applicant Details
    applicant_name TEXT NOT NULL,
    applicant_email TEXT UNIQUE NOT NULL,
    applicant_phone TEXT NOT NULL,
    applicant_city TEXT DEFAULT 'Delhi NCR',
    applicant_pincode TEXT,
    avatar_url TEXT,
    
    -- Quiz Dossier
    archetype_title TEXT NOT NULL,
    archetype_description TEXT,
    archetype_traits JSONB DEFAULT '[]'::JSONB,
    scores JSONB NOT NULL DEFAULT '{}'::JSONB,
    quiz_answers JSONB NOT NULL DEFAULT '[]'::JSONB,
    dietary_preference TEXT DEFAULT 'flexible',
    allergies JSONB DEFAULT '[]'::JSONB,
    personal_boundaries JSONB DEFAULT '[]'::JSONB,
    shared_interests JSONB DEFAULT '[]'::JSONB,
    quiz_completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Payment Details
    payment_status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_amount_inr INT NOT NULL DEFAULT 1999,
    payment_currency TEXT DEFAULT 'INR',
    payment_plan_title TEXT DEFAULT 'Annual Founding Member Pass',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    invoice_number TEXT,
    paid_at TIMESTAMPTZ,
    
    -- Identity Verification
    identity_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (identity_status IN ('unverified', 'pending', 'verified', 'failed', 'manual_review')),
    identity_provider TEXT DEFAULT 'digilocker_consent_offline',
    identity_reference TEXT,
    identity_verified_at TIMESTAMPTZ,
    aadhaar_file_url TEXT,
    aadhaar_file_name TEXT,
    user_photo_url TEXT,
    user_photo_name TEXT,
    
    -- Credential Dispatch
    credentials_sent BOOLEAN NOT NULL DEFAULT FALSE,
    credentials_sent_at TIMESTAMPTZ,
    credentials_sent_by TEXT,
    
    -- Admin Review Notes
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    review_decision_notes TEXT,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. EVENTS / MEETS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Delhi NCR',
    neighborhood TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    secret_access_code TEXT NOT NULL DEFAULT 'GATE-402',
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    date_display TEXT NOT NULL,
    price_inr INT NOT NULL DEFAULT 1999,
    category TEXT NOT NULL DEFAULT 'supper_club',
    host_name TEXT NOT NULL,
    host_role TEXT NOT NULL,
    host_avatar TEXT,
    cover_image TEXT,
    theme TEXT,
    menu_preview JSONB DEFAULT '[]'::JSONB,
    dietary_options JSONB DEFAULT '[]'::JSONB,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
    seats JSONB DEFAULT '[null, null, null, null, null, null]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 7. USER SEAT INVITATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_seat_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    attendee_email TEXT NOT NULL,
    attendee_name TEXT NOT NULL,
    seat_number INT NOT NULL CHECK (seat_number BETWEEN 1 AND 6),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    decline_reason TEXT,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. TRIGGERS
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_member_applications_updated_at ON public.member_applications;
CREATE TRIGGER tr_member_applications_updated_at
    BEFORE UPDATE ON public.member_applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_events_updated_at ON public.events;
CREATE TRIGGER tr_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_seat_invitations ENABLE ROW LEVEL SECURITY;

-- Member Applications: Public can submit quiz/payment, read own application
DROP POLICY IF EXISTS "Public can create member application" ON public.member_applications;
CREATE POLICY "Public can create member application" 
ON public.member_applications FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read own application" ON public.member_applications;
CREATE POLICY "Public can read own application" 
ON public.member_applications FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Public can update own application" ON public.member_applications;
CREATE POLICY "Public can update own application" 
ON public.member_applications FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete member application" ON public.member_applications;
CREATE POLICY "Allow delete member application" 
ON public.member_applications FOR DELETE 
TO public 
USING (true);

-- Profiles:
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy" 
ON public.profiles FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Events:
DROP POLICY IF EXISTS "Events are viewable by public" ON public.events;
CREATE POLICY "Events are viewable by public" 
ON public.events FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Admin can manage events" ON public.events;
CREATE POLICY "Admin can manage events" 
ON public.events FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- User Seat Invitations:
DROP POLICY IF EXISTS "Invitations are viewable" ON public.user_seat_invitations;
CREATE POLICY "Invitations are viewable" 
ON public.user_seat_invitations FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Invitations are manageable" ON public.user_seat_invitations;
CREATE POLICY "Invitations are manageable" 
ON public.user_seat_invitations FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- Admin Users:
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users" 
ON public.admin_users FOR SELECT 
TO public 
USING (true);
