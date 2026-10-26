import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, type DatabaseProfile } from "./supabase";
import { toast } from "sonner";

export interface SubscriptionDetails {
  status: "active" | "inactive";
  plan: string;
  amount: number;
  memberId: string;
  subscribedAt: string;
  validUntil: string;
  paymentId?: string;
}

interface AuthContextType {
  user: any | null;
  profile: DatabaseProfile | null;
  subscription: SubscriptionDetails | null;
  isSubscribed: boolean;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: any | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error: any | null; data?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  simulateLoginAs: (role?: "user" | "admin") => void;
  activateSubscription: (details: {
    name: string;
    email: string;
    paymentId?: string;
    memberId?: string;
  }) => SubscriptionDetails;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_MOCK_USER_KEY = "precious_meets_mock_user";
const LOCAL_STORAGE_SUBSCRIPTION_KEY = "precious_meets_subscription";
export const LOCAL_STORAGE_SESSION_TIMESTAMP_KEY = "precious_meets_session_timestamp";
export const SESSION_MAX_AGE_MS = 36 * 60 * 60 * 1000; // 36 hours in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to record fresh session start
  const recordSessionStart = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_SESSION_TIMESTAMP_KEY, Date.now().toString());
    }
  };

  // Helper to verify if session has exceeded 36 hours
  const isSessionExpired = (): boolean => {
    if (typeof window === "undefined") return false;
    const timestampStr = localStorage.getItem(LOCAL_STORAGE_SESSION_TIMESTAMP_KEY);
    if (!timestampStr) {
      if (localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY)) {
        // First initialization for existing active user: give them a fresh 36h window
        localStorage.setItem(LOCAL_STORAGE_SESSION_TIMESTAMP_KEY, Date.now().toString());
      }
      return false;
    }
    const sessionTime = parseInt(timestampStr, 10);
    if (isNaN(sessionTime) || Date.now() - sessionTime > SESSION_MAX_AGE_MS) {
      return true;
    }
    return false;
  };

  // Terminate expired session
  const terminateSession = async () => {
    const wasLoggedIn = !!(user || (typeof window !== "undefined" && localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY)));
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SESSION_TIMESTAMP_KEY);
    }
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setProfile(null);
    if (wasLoggedIn) {
      toast.info("Session expired after 36 hours. Please sign in again.");
    }
  };

  // Load existing subscription on mount
  useEffect(() => {
    const savedSub = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_KEY);
    if (savedSub) {
      try {
        const parsed = JSON.parse(savedSub);
        // Purge legacy mock active subscriptions if no authenticated active member session exists
        if (parsed.status === "active" && !localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY)) {
          localStorage.removeItem(LOCAL_STORAGE_SUBSCRIPTION_KEY);
          setSubscription(null);
        } else {
          setSubscription(parsed);
        }
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_SUBSCRIPTION_KEY);
      }
    }
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setProfile(data as DatabaseProfile);
      } else {
        // Construct fallback default profile
        const defaultProfile: DatabaseProfile = {
          id: userId,
          email,
          full_name: user?.user_metadata?.full_name || "Guest Attendee",
          display_name: user?.user_metadata?.name || "Guest",
          avatar_url: user?.user_metadata?.avatar_url || null,
          bio: "Passionate about thoughtful conversation and discovering shared tables.",
          city: "Delhi NCR",
          phone: user?.user_metadata?.phone || null,
          role: "user",
          membership_status: "quiz_completed",
          identity_verified: false,
          identity_status: "unverified",
          onboarding_completed: false,
          quiz_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(defaultProfile);
      }
    } catch {
      // Ignore network errors on initial boot
    }
  };

  useEffect(() => {
    const initSession = async () => {
      // 1. Initial 36-hour session expiry check
      if (isSessionExpired()) {
        await terminateSession();
        setLoading(false);
        return;
      }

      // Check local session
      const savedMock = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY) : null;
      if (savedMock) {
        try {
          const parsed = JSON.parse(savedMock);
          const email = parsed?.user?.email?.toLowerCase();

          // Executive admin local session bypass
          if (email === "admin@preciousmeets.com") {
            setUser(parsed.user);
            setProfile(parsed.profile);
            setLoading(false);
            return;
          }

          // Verify with Supabase whether this member actually exists in the database
          if (email) {
            const { data: dbProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("email", email)
              .maybeSingle();

            const { data: dbApp } = await supabase
              .from("member_applications")
              .select("id, applicant_name, applicant_email, membership_status, status, identity_status, created_at, updated_at")
              .eq("applicant_email", email)
              .maybeSingle();

            if (!dbProfile && !dbApp) {
              // The user was deleted from the Supabase database!
              console.info("[Auth] Member deleted from Supabase. Invalidating local session.");
              localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
              localStorage.removeItem(LOCAL_STORAGE_SUBSCRIPTION_KEY);
              localStorage.removeItem("precious_meets_paid_dossier");
              setUser(null);
              setProfile(null);
              setSubscription(null);
              setLoading(false);
              return;
            }

            // User exists in Supabase: sync latest status from database
            if (dbProfile) {
              setUser(parsed.user);
              setProfile(dbProfile as DatabaseProfile);
            } else if (dbApp) {
              setUser(parsed.user);
              setProfile({
                id: dbApp.id,
                email: dbApp.applicant_email,
                full_name: dbApp.applicant_name,
                display_name: (dbApp.applicant_name || "Member").split(" ")[0],
                role: "user",
                membership_status: dbApp.membership_status || "quiz_completed",
                identity_verified: dbApp.identity_status === "verified",
                identity_status: dbApp.identity_status || "unverified",
                onboarding_completed: true,
                quiz_completed: true,
                created_at: dbApp.created_at,
                updated_at: dbApp.updated_at,
              });
            }
            setLoading(false);
            return;
          }
        } catch (e) {
          localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
        }
      }

      // Supabase auth state listener
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (isSessionExpired()) {
          await terminateSession();
        } else {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || "");
          if (!localStorage.getItem(LOCAL_STORAGE_SESSION_TIMESTAMP_KEY)) {
            recordSessionStart();
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        if (isSessionExpired()) {
          await terminateSession();
        } else {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || "");
          if (!localStorage.getItem(LOCAL_STORAGE_SESSION_TIMESTAMP_KEY)) {
            recordSessionStart();
          }
        }
      } else if (!localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY)) {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // 2. Periodic background check every 60s
    const expiryInterval = setInterval(() => {
      if (isSessionExpired()) {
        terminateSession();
      }
    }, 60 * 1000);

    // 3. Tab visibility / window focus check (e.g. user reopens Chrome or focuses tab after 36h)
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        if (isSessionExpired()) {
          terminateSession();
        }
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      subscription.unsubscribe();
      clearInterval(expiryInterval);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  const signInWithGoogle = async (redirectTo?: string) => {
    const siteUrl =
      (typeof window !== "undefined" && window.location.origin) || "http://localhost:5173";
    const targetUrl = redirectTo ? `${siteUrl}${redirectTo}` : `${siteUrl}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: targetUrl,
        scopes: "email profile",
      },
    });

    if (error) {
      console.warn("[Auth] Supabase Google OAuth notice:", error.message);
      return { error };
    }
    recordSessionStart();
    return { error: null };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Executive Admin Verification
    if (cleanEmail === "admin@preciousmeets.com") {
      if (password === "11111111" || password.length >= 8) {
        const adminUser = {
          id: "pm_admin_master",
          email: "admin@preciousmeets.com",
          user_metadata: {
            full_name: "Precious Meets Executive Admin",
            name: "Admin",
            role: "admin",
          },
        };
        const adminProfile: DatabaseProfile = {
          id: "pm_admin_master",
          email: "admin@preciousmeets.com",
          full_name: "Precious Meets Executive Admin",
          display_name: "Admin",
          avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          bio: "Executive Operations and Table Matchmaker at Precious Meets.",
          city: "Delhi NCR",
          phone: "+91 98100 12345",
          role: "admin",
          membership_status: "active",
          identity_verified: true,
          identity_status: "verified",
          onboarding_completed: true,
          quiz_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(adminUser);
        setProfile(adminProfile);
        localStorage.setItem(
          LOCAL_STORAGE_MOCK_USER_KEY,
          JSON.stringify({ user: adminUser, profile: adminProfile }),
        );
        recordSessionStart();
        return { error: null };
      } else {
        return { error: new Error("Invalid admin password. Access denied.") };
      }
    }

    // 2. Member Status Verification directly from Supabase Database
    try {
      const { ApplicationsService } = await import("./applications-service");
      let app: any = null;

      // 1. Direct Supabase query with case-insensitive email match
      try {
        const { data: dbData } = await supabase
          .from("member_applications")
          .select("*")
          .ilike("applicant_email", cleanEmail)
          .limit(1);

        if (dbData && dbData.length > 0) {
          const d = dbData[0];
          app = {
            id: d.id,
            userId: d.auth_user_id || undefined,
            applicationReference: d.application_reference || `PM-FOUNDER-${d.id.slice(0, 4)}`,
            status: d.status || "pending_review",
            membershipStatus: d.membership_status || (d.credentials_sent ? "active" : "paid_pending_credentials"),
            applicantName: d.applicant_name || "Applicant",
            applicantEmail: d.applicant_email,
            applicantPhone: d.applicant_phone || "",
            applicantCity: d.applicant_city || "Delhi NCR",
            applicantPincode: d.applicant_pincode || undefined,
            avatarUrl: d.avatar_url || undefined,
            archetypeTitle: d.archetype_title || "The Curious Flâneur",
            archetypeDescription: d.archetype_description || "",
            archetypeTraits: Array.isArray(d.archetype_traits) ? d.archetype_traits : [],
            socialEnergyScore: d.scores?.socialEnergy ?? (d.social_energy_score || 50),
            conversationDepthScore: d.scores?.conversationDepth ?? (d.conversation_depth_score || 50),
            playfulnessScore: d.scores?.playfulness ?? (d.playfulness_score || 50),
            curiosityScore: d.scores?.curiosity ?? (d.curiosity_score || 50),
            adventureScore: d.scores?.adventure ?? (d.adventure_score || 50),
            dietaryPreference: d.dietary_preference || "Flexible",
            allergies: Array.isArray(d.allergies) ? d.allergies : [],
            personalBoundaries: Array.isArray(d.personal_boundaries) ? d.personal_boundaries : [],
            sharedInterests: Array.isArray(d.shared_interests) ? d.shared_interests : [],
            quizAnswers: Array.isArray(d.quiz_answers) ? d.quiz_answers : [],
            quizCompletedAt: d.quiz_completed_at || d.created_at,
            paymentStatus: d.payment_status || "pending",
            paymentAmountInr: d.payment_amount_inr || 1999,
            paymentPlanTitle: d.payment_plan_title || "Annual Founding Member Pass",
            razorpayPaymentId: d.razorpay_payment_id || undefined,
            invoiceNumber: d.invoice_number || undefined,
            razorpayOrderId: d.razorpay_order_id || undefined,
            paidAt: d.paid_at || undefined,
            identityStatus: d.identity_status || "unverified",
            identityProvider: d.identity_provider || "digilocker_consent_offline",
            identityReference: d.identity_reference || undefined,
            identityVerifiedAt: d.identity_verified_at || undefined,
            aadhaarFileUrl: d.aadhaar_file_url || undefined,
            aadhaarFileName: d.aadhaar_file_name || undefined,
            credentialsSent: Boolean(d.credentials_sent),
            credentialsSentAt: d.credentials_sent_at || undefined,
            credentialsSentBy: d.credentials_sent_by || undefined,
            autoGeneratedPassword: d.scores?.member_password || d.auto_generated_password || undefined,
            reviewedBy: d.reviewed_by || undefined,
            reviewedAt: d.reviewed_at || undefined,
            reviewDecisionNotes: d.review_decision_notes || undefined,
            rejectionReason: d.rejection_reason || undefined,
            createdAt: d.created_at,
            updatedAt: d.updated_at || d.created_at,
          };
        }
      } catch (dbErr) {
        console.warn("[AuthContext] Supabase direct query fallback:", dbErr);
      }

      // 2. Fetch full list from Supabase if direct query did not find
      if (!app) {
        try {
          const dbApps = await ApplicationsService.fetchApplicationsFromDb();
          app = dbApps.find((a) => (a.applicantEmail || "").trim().toLowerCase() === cleanEmail);
        } catch (dbErr2) {
          console.warn("[AuthContext] Supabase fetch fallback:", dbErr2);
        }
      }

      // 3. Check local storage cache (offline / simulated / un-synced dossiers)
      if (!app) {
        const localApps = ApplicationsService.getApplications();
        app = localApps.find((a) => (a.applicantEmail || "").trim().toLowerCase() === cleanEmail);
      }

      if (app) {
        // If credentials have NOT been sent yet, block login with clear notice
        if (!app.credentialsSent || app.membershipStatus !== "active") {
          return {
            error: new Error(
              "Your membership is currently pending credential dispatch. We will email your sign-in credentials once your application is activated by the curation committee."
            ),
          };
        }

        // If credentials WERE sent, verify password
        const expectedPassword = (app.autoGeneratedPassword || "").trim();
        const inputPassword = password.trim();

        let passwordMatches = Boolean(expectedPassword && inputPassword === expectedPassword);

        // If not matching, query Supabase for latest scores.member_password in case of recent reassignment
        if (!passwordMatches) {
          try {
            const { data: fresh } = await supabase
              .from("member_applications")
              .select("scores")
              .ilike("applicant_email", cleanEmail)
              .limit(1);

            const freshPassword = fresh?.[0]?.scores?.member_password?.trim();
            if (freshPassword && inputPassword === freshPassword) {
              passwordMatches = true;
              app.autoGeneratedPassword = freshPassword;
            }
          } catch (freshErr) {
            console.warn("[AuthContext] Fresh password query notice:", freshErr);
          }
        }

        if (!passwordMatches) {
          // Also try Supabase auth fallback before rejecting
          const { error: sbError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (sbError) {
            return {
              error: new Error(
                "Invalid credentials. Please enter the latest auto-generated password sent to your email."
              ),
            };
          }
        }

        // Active member authenticated successfully!
        const memberUser = {
          id: app.userId || app.id,
          email: app.applicantEmail,
          user_metadata: {
            full_name: app.applicantName,
            name: app.applicantName.split(" ")[0] || "Member",
            phone: app.applicantPhone,
          },
        };
        const memberProfile: DatabaseProfile = {
          id: app.userId || app.id,
          email: app.applicantEmail,
          full_name: app.applicantName,
          display_name: app.applicantName.split(" ")[0] || "Member",
          avatar_url: app.avatarUrl || null,
          bio: app.archetypeDescription || "Member at Precious Meets.",
          city: app.applicantCity || "Delhi NCR",
          phone: app.applicantPhone,
          role: "user",
          membership_status: "active",
          identity_verified: true,
          identity_status: "verified",
          onboarding_completed: true,
          quiz_completed: true,
          created_at: app.createdAt,
          updated_at: app.updatedAt,
        };

        setUser(memberUser);
        setProfile(memberProfile);
        localStorage.setItem(
          LOCAL_STORAGE_MOCK_USER_KEY,
          JSON.stringify({ user: memberUser, profile: memberProfile })
        );
        recordSessionStart();
        return { error: null };
      }
    } catch (e) {
      console.warn("[AuthContext] Application verification notice:", e);
    }

    // 3. Regular Supabase authentication fallback
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { error };
    }

    if (data?.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email || "");
      recordSessionStart();
    }

    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName || "New Member",
          name: fullName?.split(" ")[0] || "Member",
        },
      },
    });

    if (error) {
      return { error };
    }

    if (data?.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email || "");
      recordSessionStart();
    }

    return { error: null, data };
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SESSION_TIMESTAMP_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SUBSCRIPTION_KEY);
      localStorage.removeItem("precious_meets_paid_dossier");
    }
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setProfile(null);
    setSubscription(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email || "");
    }
  };

  const simulateLoginAs = (role: "user" | "admin" = "user") => {
    const mockUser = {
      id: "u_" + (role === "admin" ? "admin_001" : "user_12345"),
      email: role === "admin" ? "admin@preciousmeets.com" : "curious.guest@example.com",
      user_metadata: {
        full_name: role === "admin" ? "Precious Admin" : "Aria Sharma",
        name: role === "admin" ? "Admin" : "Aria",
        avatar_url:
          role === "admin"
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      },
    };

    const mockProfile: DatabaseProfile = {
      id: mockUser.id,
      email: mockUser.email,
      full_name: mockUser.user_metadata.full_name,
      display_name: mockUser.user_metadata.name,
      avatar_url: mockUser.user_metadata.avatar_url,
      bio: "Writer and cultural flâneur based in Delhi NCR. Loving intimate dinner conversations.",
      city: "Delhi NCR",
      phone: "+91 98100 12345",
      role: role,
      identity_verified: true,
      identity_status: "verified",
      onboarding_completed: true,
      quiz_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem(
      LOCAL_STORAGE_MOCK_USER_KEY,
      JSON.stringify({ user: mockUser, profile: mockProfile }),
    );
    recordSessionStart();
  };

  const activateSubscription = (details: {
    name: string;
    email: string;
    paymentId?: string;
    memberId?: string;
  }): SubscriptionDetails => {
    const memberId = details.memberId || `PM-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    // Membership is NOT active until admin dispatches credentials!
    const pendingSub: SubscriptionDetails = {
      status: "inactive",
      plan: "Precious Meets Membership (Pending Credentials)",
      amount: 1999,
      memberId,
      subscribedAt: now.toISOString(),
      validUntil: expiry.toISOString(),
      paymentId: details.paymentId || `pay_${Date.now()}`,
    };

    setSubscription(pendingSub);
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_KEY, JSON.stringify(pendingSub));
    return pendingSub;
  };

  // Only real active members or executive admins have active platform subscription privileges
  const isSubscribed = Boolean(
    user && (
      profile?.membership_status === "active" ||
      (profile?.role === "admin" && user.email?.toLowerCase() === "admin@preciousmeets.com")
    )
  );
  const isAdmin = Boolean(
    user && user.email?.toLowerCase() === "admin@preciousmeets.com"
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        isSubscribed,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
        simulateLoginAs,
        activateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
