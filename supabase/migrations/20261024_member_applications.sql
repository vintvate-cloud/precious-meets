-- ==============================================================================
-- PRECIOUS MEETS - MEMBER APPLICATIONS & DOSSIERS MIGRATION
-- Production-ready Membership Applications, Quiz Dossiers & Executive Review
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.member_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_reference TEXT UNIQUE NOT NULL, -- e.g. PM-FILE-2026-8941
    
    -- Status lifecycle
    status TEXT NOT NULL DEFAULT 'pending_review' 
        CHECK (status IN ('draft', 'quiz_completed', 'payment_pending', 'pending_review', 'approved', 'rejected')),
    
    -- Applicant Personal Snapshot
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    applicant_city TEXT DEFAULT 'Delhi NCR',
    avatar_url TEXT,
    
    -- Quiz & Personality Dossier
    archetype_title TEXT,
    archetype_description TEXT,
    archetype_traits TEXT[] DEFAULT ARRAY[]::TEXT[],
    social_energy_score NUMERIC(5,2) DEFAULT 50.0,
    conversation_depth_score NUMERIC(5,2) DEFAULT 50.0,
    playfulness_score NUMERIC(5,2) DEFAULT 50.0,
    curiosity_score NUMERIC(5,2) DEFAULT 50.0,
    adventure_score NUMERIC(5,2) DEFAULT 50.0,
    dietary_preference TEXT DEFAULT 'flexible',
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    personal_boundaries TEXT[] DEFAULT ARRAY[]::TEXT[],
    shared_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    quiz_answers_json JSONB DEFAULT '{}'::JSONB,
    quiz_completed_at TIMESTAMPTZ,
    
    -- Financial / Payment Record
    payment_status TEXT NOT NULL DEFAULT 'unpaid' 
        CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
    payment_amount_inr INT DEFAULT 199900, -- in paise (e.g. 199900 = INR 1,999)
    payment_currency TEXT DEFAULT 'INR',
    payment_plan_title TEXT DEFAULT 'Annual Founding Member',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    paid_at TIMESTAMPTZ,
    
    -- Aadhaar & Identity Verification Record
    identity_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (identity_status IN ('unverified', 'pending', 'verified', 'failed', 'manual_review')),
    identity_provider TEXT DEFAULT 'digilocker_consent_offline',
    identity_reference TEXT,
    identity_verified_at TIMESTAMPTZ,
    identity_metadata JSONB DEFAULT '{}'::JSONB,
    
    -- Executive Review & Decision
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_decision_notes TEXT,
    rejection_reason TEXT,
    
    -- Email Notification Audit
    decision_email_sent_at TIMESTAMPTZ,
    decision_email_template TEXT,
    decision_email_resend_id TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON public.member_applications(status);
CREATE INDEX IF NOT EXISTS idx_member_applications_email ON public.member_applications(applicant_email);
CREATE INDEX IF NOT EXISTS idx_member_applications_user_id ON public.member_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_member_applications_created_at ON public.member_applications(created_at DESC);
