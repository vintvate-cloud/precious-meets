-- ==============================================================================
-- PRECIOUS MEETS - SUPABASE POSTGRESQL INITIAL SCHEMA & MIGRATION
-- Production-ready Social Discovery, Matching & Safety Platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Extends auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    city TEXT DEFAULT 'Mumbai',
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'host', 'moderator', 'admin')),
    identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    identity_status TEXT NOT NULL DEFAULT 'unverified' CHECK (identity_status IN ('unverified', 'pending', 'verified', 'failed', 'expired', 'manual_review')),
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    quiz_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. USER PREFERENCES & BOUNDARIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    preferred_cities TEXT[] DEFAULT ARRAY['Mumbai'],
    languages TEXT[] DEFAULT ARRAY['English'],
    dietary_preference TEXT DEFAULT 'flexible' CHECK (dietary_preference IN ('vegetarian', 'vegan', 'non-vegetarian', 'jain', 'eggetarian', 'flexible')),
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    social_energy_score NUMERIC(5,2) DEFAULT 50.0,
    conversation_depth_score NUMERIC(5,2) DEFAULT 50.0,
    playfulness_score NUMERIC(5,2) DEFAULT 50.0,
    curiosity_score NUMERIC(5,2) DEFAULT 50.0,
    adventure_score NUMERIC(5,2) DEFAULT 50.0,
    lifestyle_schedule TEXT DEFAULT 'weekends',
    max_group_size INT DEFAULT 6,
    personal_boundaries TEXT[] DEFAULT ARRAY[]::TEXT[],
    interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. QUIZ QUESTIONS & OPTIONS (Configurable via Admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_order INT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN (
        'social_energy', 'conversation_style', 'interests', 'lifestyle',
        'food_preferences', 'experience_preferences', 'group_preferences',
        'communication', 'personal_boundaries', 'scheduling'
    )),
    title TEXT NOT NULL,
    subtitle TEXT,
    question_type TEXT NOT NULL DEFAULT 'single_select' CHECK (question_type IN ('single_select', 'multi_select', 'slider', 'short_text')),
    dimension_impacted TEXT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.quiz_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    sublabel TEXT,
    value TEXT NOT NULL,
    score_modifier INT NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 1
);

-- ------------------------------------------------------------------------------
-- 4. QUIZ ATTEMPTS, ANSWERS & RESULTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    anonymous_session_id TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    algorithm_version TEXT NOT NULL DEFAULT 'v1.0.0',
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    selected_values TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    slider_value NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE UNIQUE,
    archetype_title TEXT NOT NULL,
    archetype_description TEXT NOT NULL,
    social_energy NUMERIC(5,2) NOT NULL,
    conversation_depth NUMERIC(5,2) NOT NULL,
    playfulness NUMERIC(5,2) NOT NULL,
    curiosity NUMERIC(5,2) NOT NULL,
    adventure NUMERIC(5,2) NOT NULL,
    recommended_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. EXPERIENCES & SESSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('supper_club', 'coffee_tasting', 'cultural_walk', 'creative_salon', 'after_dark')),
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    city TEXT NOT NULL DEFAULT 'Mumbai',
    neighborhood TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    price_inr INT NOT NULL, -- in paise/integers, e.g. 199900 = INR 1999
    host_name TEXT NOT NULL,
    host_avatar TEXT,
    host_bio TEXT,
    max_capacity INT NOT NULL DEFAULT 6,
    dietary_options TEXT[] DEFAULT ARRAY['vegetarian', 'vegan', 'non-vegetarian'],
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'sold_out', 'cancelled', 'completed')),
    cancellation_policy TEXT NOT NULL DEFAULT 'Full refund up to 48 hours before the meet.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.experience_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    total_seats INT NOT NULL DEFAULT 6,
    booked_seats INT NOT NULL DEFAULT 0,
    booking_deadline TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. MATCHED GROUPS & GROUP MEMBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.experience_sessions(id) ON DELETE CASCADE,
    group_name TEXT NOT NULL,
    compatibility_score NUMERIC(5,2) DEFAULT 88.5,
    table_number INT DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'locked', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(group_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 7. BOOKINGS & SEAT RESERVATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.experience_sessions(id) ON DELETE RESTRICT,
    seats_count INT NOT NULL DEFAULT 1,
    total_amount_inr INT NOT NULL, -- in paise
    dietary_notes TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded', 'attended', 'no_show')),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. RAZORPAY PAYMENT ORDERS, PAYMENTS & REFUNDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    amount_in_paise INT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    razorpay_signature TEXT NOT NULL,
    amount_in_paise INT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    method TEXT DEFAULT 'card',
    verified_server_side BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by_webhook BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'captured' CHECK (status IN ('authorized', 'captured', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    razorpay_refund_id TEXT UNIQUE NOT NULL,
    amount_in_paise INT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('pending', 'processed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. IDENTITY VERIFICATIONS (Compliant with UIDAI rules - no raw numbers/biometrics)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.identity_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'sandbox_provider',
    provider_reference TEXT UNIQUE NOT NULL,
    verification_method TEXT NOT NULL DEFAULT 'digilocker_consent_offline',
    consent_obtained_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'expired', 'manual_review')),
    failure_reason TEXT,
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. NOTIFICATION PREFERENCES, PUSH SUBSCRIPTIONS & LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    email_booking_confirmations BOOLEAN NOT NULL DEFAULT TRUE,
    email_event_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    email_marketing BOOLEAN NOT NULL DEFAULT FALSE,
    push_booking_updates BOOLEAN NOT NULL DEFAULT TRUE,
    push_chat_messages BOOLEAN NOT NULL DEFAULT TRUE,
    push_safety_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    channel TEXT NOT NULL CHECK (channel IN ('push', 'sms', 'in_app')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.email_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email TEXT NOT NULL,
    template_name TEXT NOT NULL,
    resend_id TEXT,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'complained', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 11. SOS SAFETY INCIDENTS & SAFETY EVENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.safety_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_reference TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('emergency', 'discomfort', 'harassment', 'medical', 'venue_safety', 'other')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'in_progress', 'resolved', 'closed', 'false_alarm')),
    user_notes TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    location_shared BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_admin_id UUID REFERENCES public.profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.safety_incident_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES public.safety_incidents(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_incident_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read for published experiences and quiz questions
CREATE POLICY "Public experiences are viewable by everyone" ON public.experiences
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public experience sessions viewable by everyone" ON public.experience_sessions
    FOR SELECT USING (TRUE);

CREATE POLICY "Quiz questions are readable by everyone" ON public.quiz_questions
    FOR SELECT USING (TRUE);

CREATE POLICY "Quiz options are readable by everyone" ON public.quiz_options
    FOR SELECT USING (TRUE);

-- Profiles: users read & update their own profile; admins read all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Preferences: users can read & update their own preferences
CREATE POLICY "Users manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Bookings: users can view and create their own bookings
CREATE POLICY "Users view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz attempts & results
CREATE POLICY "Users manage own quiz attempts" ON public.quiz_attempts
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users view own quiz results" ON public.quiz_results
    FOR SELECT USING (auth.uid() = user_id);

-- Safety Incidents: users can create and view their own incidents
CREATE POLICY "Users can create SOS incidents" ON public.safety_incidents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own SOS incidents" ON public.safety_incidents
    FOR SELECT USING (auth.uid() = user_id);

-- Push subscriptions: users manage own subscriptions
CREATE POLICY "Users manage own push subscriptions" ON public.push_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 13. SEED DATA - INITIAL EXPERIENCES ACROSS CITIES
-- ------------------------------------------------------------------------------
INSERT INTO public.experiences (id, title, slug, tagline, description, category, cover_image, city, neighborhood, venue_name, venue_address, price_inr, host_name, host_avatar, host_bio, max_capacity, dietary_options, status)
VALUES 
(
    'a1111111-1111-1111-1111-111111111111',
    'The Long Table Supper',
    'the-long-table-supper-mumbai',
    'Six strangers, four courses, one candlelit table.',
    'An unhurried four-course feast in a hidden private dining loft in Bandra. Paired with natural wines and guided conversation starters that skip the small talk.',
    'supper_club',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'Mumbai',
    'Bandra West',
    'The Attic at Chapel Road',
    'Chapel Road, Ranwar Village, Bandra West, Mumbai 400050',
    249900,
    'Chef Tara Sen',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'Culinary anthropologist and supper club creator exploring forgotten regional Indian recipes.',
    6,
    ARRAY['vegetarian', 'non-vegetarian', 'jain'],
    'published'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Slow Coffee & Vinyl Sunday',
    'slow-coffee-vinyl-bengaluru',
    'Unhurried conversations over single-origin pours.',
    'Wake up slowly on Sunday morning with artisanal pour-overs, rare vinyl jazz records, and deep discussions with fellow thinkers and creative minds.',
    'coffee_tasting',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',
    'Bengaluru',
    'Indiranagar',
    'Cask & Bean Roastery',
    '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    119900,
    'Arjun Varma',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'Q-grader and vinyl record collector passionate about tactile subcultures.',
    6,
    ARRAY['vegetarian', 'vegan'],
    'published'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'After-Dark Walk & Wine',
    'after-dark-walk-and-wine-delhi',
    'A twilight stroll, ancient ruins, and a quiet rooftop.',
    'An evocative twilight walking dialogue through Hauz Khas monuments followed by a reserved rooftop wine and tapas gathering with six compatible attendees.',
    'after_dark',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
    'Delhi',
    'Hauz Khas',
    'The Reservoir Terrace',
    'Hauz Khas Village, New Delhi 110016',
    189900,
    'Kabir Mehta',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    'Architectural historian and storyteller documenting Delhi after dark.',
    6,
    ARRAY['vegetarian', 'non-vegetarian'],
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- Seed sessions for the experiences
INSERT INTO public.experience_sessions (id, experience_id, starts_at, ends_at, total_seats, booked_seats, booking_deadline, status)
VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    timezone('utc'::text, now() + interval '3 days 4 hours'),
    timezone('utc'::text, now() + interval '3 days 7 hours'),
    6,
    2,
    timezone('utc'::text, now() + interval '2 days'),
    'open'
),
(
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    timezone('utc'::text, now() + interval '5 days 2 hours'),
    timezone('utc'::text, now() + interval '5 days 5 hours'),
    6,
    4,
    timezone('utc'::text, now() + interval '4 days'),
    'open'
),
(
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    timezone('utc'::text, now() + interval '7 days 5 hours'),
    timezone('utc'::text, now() + interval '7 days 8 hours'),
    6,
    1,
    timezone('utc'::text, now() + interval '6 days'),
    'open'
)
ON CONFLICT (id) DO NOTHING;
