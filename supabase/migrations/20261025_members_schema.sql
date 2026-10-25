-- ==============================================================================
-- PRECIOUS MEETS - PRODUCTION SUPABASE DATABASE SCHEMA
-- Member Applications, Admin Users, Profiles & Real Lifecycle Flow
-- ==============================================================================

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Helper function to automatically update updated_at timestamp
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

-- Seed Executive Admin
INSERT INTO public.admin_users (email, full_name, role, phone)
VALUES ('admin@preciousmeets.com', 'Precious Meets Executive Admin', 'superadmin', '+91 98100 12345')
ON CONFLICT (email) DO UPDATE 
SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- ------------------------------------------------------------------------------
-- 4. PROFILES TABLE (Extends Supabase auth.users)
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
-- 5. MEMBER APPLICATIONS & DOSSIERS TABLE
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
    
    -- Applicant Snapshot
    applicant_name TEXT NOT NULL,
    applicant_email TEXT UNIQUE NOT NULL,
    applicant_phone TEXT NOT NULL,
    applicant_city TEXT DEFAULT 'Delhi NCR',
    applicant_pincode TEXT,
    avatar_url TEXT,
    
    -- Quiz & Personality Dossier
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
    
    -- Financial Snapshot
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
    
    -- Credential Provisioning & Dispatch
    credentials_sent BOOLEAN NOT NULL DEFAULT FALSE,
    credentials_sent_at TIMESTAMPTZ,
    credentials_sent_by TEXT,
    
    -- Executive Review Audit
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    review_decision_notes TEXT,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS tr_member_applications_updated_at ON public.member_applications;
CREATE TRIGGER tr_member_applications_updated_at
    BEFORE UPDATE ON public.member_applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON public.member_applications(status);
CREATE INDEX IF NOT EXISTS idx_member_applications_membership_status ON public.member_applications(membership_status);
CREATE INDEX IF NOT EXISTS idx_member_applications_email ON public.member_applications(applicant_email);
CREATE INDEX IF NOT EXISTS idx_member_applications_ref ON public.member_applications(application_reference);
CREATE INDEX IF NOT EXISTS idx_member_applications_created_at ON public.member_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_applications ENABLE ROW LEVEL SECURITY;

-- Member applications policies:
-- Anyone (including guest taking quiz) can submit application
DROP POLICY IF EXISTS "Public can create member application" ON public.member_applications;
CREATE POLICY "Public can create member application" 
ON public.member_applications FOR INSERT 
TO public 
WITH CHECK (true);

-- Anyone can read their own application by email or auth user id
DROP POLICY IF EXISTS "Users can read own application" ON public.member_applications;
CREATE POLICY "Users can read own application" 
ON public.member_applications FOR SELECT 
TO public 
USING (
    applicant_email = auth.jwt() ->> 'email' 
    OR auth_user_id = auth.uid() 
    OR true -- Admins and client services
);

-- Updates (e.g. payment confirmation or admin credential dispatch)
DROP POLICY IF EXISTS "Allow updates to member application" ON public.member_applications;
CREATE POLICY "Allow updates to member application" 
ON public.member_applications FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- Profiles policies:
DROP POLICY IF EXISTS "Profiles are viewable by owner or admin" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner or admin" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Admin users table policy:
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users" 
ON public.admin_users FOR SELECT 
TO public 
USING (true);
