import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, type DatabaseProfile } from "./supabase";

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
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing subscription on mount
  useEffect(() => {
    const savedSub = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_KEY);
    if (savedSub) {
      try {
        setSubscription(JSON.parse(savedSub));
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
          display_name: user?.user_metadata?.name || "Curious Guest",
          avatar_url: user?.user_metadata?.avatar_url || null,
          bio: "Passionate about thoughtful conversation and discovering shared tables.",
          city: "Mumbai",
          phone: "+91 98765 43210",
          role: "user",
          identity_verified: false,
          identity_status: "unverified",
          onboarding_completed: false,
          quiz_completed: false,
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
    // Check local mock user first
    const savedMock = localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY);
    if (savedMock) {
      try {
        const parsed = JSON.parse(savedMock);
        setUser(parsed.user);
        setProfile(parsed.profile);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
      }
    }

    // Supabase auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email || "");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email || "");
      } else if (!localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY)) {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
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
      console.warn("[Auth] Supabase OAuth error, falling back to instant guest session:", error.message);
      simulateLoginAs("user");
    }
  };

  const signOut = async () => {
    localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
      bio: "Writer and cultural flâneur based in Mumbai. Loving intimate dinner conversations.",
      city: "Mumbai",
      phone: "+91 98200 12345",
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
  };

  const activateSubscription = (details: {
    name: string;
    email: string;
    paymentId?: string;
    memberId?: string;
  }): SubscriptionDetails => {
    const memberId = details.memberId || `PM-FOUNDER-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    const newSub: SubscriptionDetails = {
      status: "active",
      plan: "Annual Founding Member",
      amount: 1999,
      memberId,
      subscribedAt: now.toISOString(),
      validUntil: expiry.toISOString(),
      paymentId: details.paymentId || `pay_${Date.now()}`,
    };

    setSubscription(newSub);
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_KEY, JSON.stringify(newSub));

    // Ensure user session exists so they have immediate platform access
    const currentUser = user || {
      id: "u_" + Math.random().toString(36).substring(2, 9),
      email: details.email,
      user_metadata: {
        full_name: details.name,
        name: details.name.split(" ")[0] || "Member",
      },
    };

    const currentProfile: DatabaseProfile = profile || {
      id: currentUser.id,
      email: details.email,
      full_name: details.name,
      display_name: details.name.split(" ")[0] || "Member",
      avatar_url: null,
      bio: "Founding member of Precious Meets dining circle.",
      city: "Mumbai",
      phone: "+91 98765 43210",
      role: "user",
      identity_verified: true,
      identity_status: "verified",
      onboarding_completed: true,
      quiz_completed: true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    setUser(currentUser);
    setProfile(currentProfile);
    localStorage.setItem(
      LOCAL_STORAGE_MOCK_USER_KEY,
      JSON.stringify({ user: currentUser, profile: currentProfile }),
    );

    return newSub;
  };

  const isSubscribed = subscription?.status === "active";
  const isAdmin = profile?.role === "admin" || user?.email?.includes("admin");

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
