import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_URL"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) ||
  (import.meta as any).env?.["NEXT_PUBLIC_SUPABASE_URL"] ||
  (import.meta as any).env?.["VITE_SUPABASE_URL"] ||
  "https://vdupycmvzsiepdrqdkrb.supabase.co";

const supabaseAnonKey =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_ANON_KEY"]) ||
  (import.meta as any).env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
  (import.meta as any).env?.["VITE_SUPABASE_ANON_KEY"] ||
  "sb_publishable_USouOQHxjrYce4oASvxOfQ_O11xKgX1";

// Public client for browser use
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Server-side admin client (only initialize when secret is present)
export const getSupabaseAdmin = () => {
  const serviceRoleKey =
    typeof process !== "undefined" ? process.env?.["SUPABASE_SERVICE_ROLE_KEY"] : undefined;

  if (!serviceRoleKey) {
    console.warn(
      "[Supabase] SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations will fallback to public client.",
    );
    return supabase;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export type DatabaseProfile = {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string;
  phone: string | null;
  role: "user" | "host" | "moderator" | "admin";
  membership_status?: "quiz_completed" | "paid_pending_credentials" | "active" | "rejected" | "suspended";
  identity_verified: boolean;
  identity_status: "unverified" | "pending" | "verified" | "failed" | "expired" | "manual_review";
  onboarding_completed: boolean;
  quiz_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: "supper_club" | "coffee_tasting" | "cultural_walk" | "creative_salon" | "after_dark";
  cover_image: string;
  gallery_images: string[];
  city: string;
  neighborhood: string;
  venue_name: string;
  venue_address: string;
  price_inr: number; // in paise
  host_name: string;
  host_avatar: string;
  host_bio: string;
  max_capacity: number;
  dietary_options: string[];
  status: "draft" | "published" | "sold_out" | "cancelled" | "completed";
  cancellation_policy: string;
  sessions?: ExperienceSession[];
};

export type ExperienceSession = {
  id: string;
  experience_id: string;
  starts_at: string;
  ends_at: string;
  total_seats: number;
  booked_seats: number;
  booking_deadline: string;
  status: "open" | "full" | "cancelled" | "completed";
};

export type Booking = {
  id: string;
  booking_reference: string;
  user_id: string;
  session_id: string;
  seats_count: number;
  total_amount_inr: number;
  dietary_notes?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status: "pending" | "confirmed" | "cancelled" | "refunded" | "attended" | "no_show";
  confirmed_at?: string;
  created_at: string;
};
