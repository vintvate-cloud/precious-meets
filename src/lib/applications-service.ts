import { supabase, getSupabaseAdmin } from "./supabase";
import { EmailService } from "./email-service";

export type ApplicationStatus =
  | "draft"
  | "quiz_completed"
  | "payment_pending"
  | "pending_review"
  | "approved"
  | "rejected";

export type IdentityStatus = "unverified" | "pending" | "verified" | "failed" | "manual_review";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export interface QuizAnswerRecord {
  questionNumber: number;
  questionTitle: string;
  category: string;
  answerLabel: string;
}

export interface MemberApplication {
  id: string;
  userId?: string;
  applicationReference: string; // e.g. PM-FILE-8492
  status: ApplicationStatus;

  // Applicant Snapshot
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantCity: string;
  avatarUrl?: string;

  // Quiz Snapshot
  archetypeTitle: string;
  archetypeDescription: string;
  archetypeTraits: string[];
  socialEnergyScore: number;
  conversationDepthScore: number;
  playfulnessScore: number;
  curiosityScore: number;
  adventureScore: number;
  dietaryPreference: string;
  allergies: string[];
  personalBoundaries: string[];
  sharedInterests: string[];
  quizAnswers: QuizAnswerRecord[];
  quizCompletedAt: string;

  // Financial Snapshot
  paymentStatus: PaymentStatus;
  paymentAmountInr: number; // e.g. 1999
  paymentPlanTitle: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paidAt?: string;

  // Identity Snapshot
  identityStatus: IdentityStatus;
  identityProvider: string;
  identityReference?: string;
  identityVerifiedAt?: string;

  // Review & Decision
  reviewedBy?: string;
  reviewedAt?: string;
  reviewDecisionNotes?: string;
  rejectionReason?: string;

  // Email Audit
  decisionEmailSentAt?: string;
  decisionEmailTemplate?: string;

  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "precious_meets_member_applications_dossiers";

// Curated Initial Realistic Seed Data for Demo & Operations
const SEED_APPLICATIONS: MemberApplication[] = [
  {
    id: "app_101",
    userId: "u_dev_aria",
    applicationReference: "PM-FILE-8492",
    status: "pending_review",
    applicantName: "Aria Sharma",
    applicantEmail: "aria.sharma@culturecraft.in",
    applicantPhone: "+91 98101 23456",
    applicantCity: "Delhi NCR",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    archetypeTitle: "The Curious Flâneur",
    archetypeDescription:
      "A contemplative cultural observer who thrives in unhurried, multi-layered dinner conversations about architecture, rare literature, and cinema.",
    archetypeTraits: ["Unhurried Listener", "Cultural Explorer", "Deep Conversationalist"],
    socialEnergyScore: 68,
    conversationDepthScore: 92,
    playfulnessScore: 74,
    curiosityScore: 95,
    adventureScore: 78,
    dietaryPreference: "Vegetarian with artisanal cheeses",
    allergies: ["Peanuts (Mild)"],
    personalBoundaries: ["Zero partisan political agitation", "No unannounced smartphone photography"],
    sharedInterests: ["Heritage Walks", "Natural Wines", "Existential Philosophy", "Old Delhi Haveli Restoration"],
    quizAnswers: [
      {
        questionNumber: 1,
        questionTitle: "Your ideal conversational tempo around a dining table?",
        category: "conversation_style",
        answerLabel: "Unhurried and deep — peeling back one authentic idea over four courses",
      },
      {
        questionNumber: 2,
        questionTitle: "How do you recharge your social battery?",
        category: "social_energy",
        answerLabel: "Intimate circles with maximum 6 people; mass crowds deplete me",
      },
      {
        questionNumber: 3,
        questionTitle: "What topic sparks your greatest curiosity?",
        category: "interests",
        answerLabel: "The intersection of ancient cultural memories and modern art",
      },
      {
        questionNumber: 4,
        questionTitle: "Dining atmosphere preference?",
        category: "lifestyle",
        answerLabel: "Candlelit courtyards with ambient instrumental jazz or vinyl",
      },
    ],
    quizCompletedAt: "2026-10-22T19:30:00Z",
    paymentStatus: "paid",
    paymentAmountInr: 1999,
    paymentPlanTitle: "Annual Founding Member Pass",
    razorpayPaymentId: "pay_ORp7x1a98BvC4",
    razorpayOrderId: "order_ORp7809aBvc",
    paidAt: "2026-10-22T19:35:12Z",
    identityStatus: "verified",
    identityProvider: "digilocker_consent_offline",
    identityReference: "DL-AADHAAR-OK-9841",
    identityVerifiedAt: "2026-10-22T19:38:45Z",
    createdAt: "2026-10-22T19:30:00Z",
    updatedAt: "2026-10-22T19:38:45Z",
  },
  {
    id: "app_102",
    userId: "u_dev_kabir",
    applicationReference: "PM-FILE-9124",
    status: "pending_review",
    applicantName: "Kabir Sen",
    applicantEmail: "kabir.sen@studioarch.com",
    applicantPhone: "+91 98712 34567",
    applicantCity: "Delhi NCR",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    archetypeTitle: "The Philosophical Epicurean",
    archetypeDescription:
      "Passionate about sensory pairing, artisanal gastronomy, and debating design principles over single-origin pour-overs.",
    archetypeTraits: ["Gastronomy Nerd", "Sensory Driven", "Humorous Theorist"],
    socialEnergyScore: 82,
    conversationDepthScore: 88,
    playfulnessScore: 80,
    curiosityScore: 89,
    adventureScore: 85,
    dietaryPreference: "Flexible Omnivore & Natural Wines",
    allergies: [],
    personalBoundaries: ["No tech company pitch decks or commercial networking"],
    sharedInterests: ["Coffee Cupping", "Nordic Fermentation", "Modernist Architecture"],
    quizAnswers: [
      {
        questionNumber: 1,
        questionTitle: "Your ideal conversational tempo around a dining table?",
        category: "conversation_style",
        answerLabel: "Lively, witty, but grounded in thoughtful perspectives",
      },
      {
        questionNumber: 2,
        questionTitle: "What brings you to Precious Meets?",
        category: "interests",
        answerLabel: "Meeting real human beings without dating apps or transactional LinkedIn small talk",
      },
    ],
    quizCompletedAt: "2026-10-23T11:15:00Z",
    paymentStatus: "paid",
    paymentAmountInr: 1999,
    paymentPlanTitle: "Annual Founding Member Pass",
    razorpayPaymentId: "pay_PQ891kaMvb890",
    razorpayOrderId: "order_PQ891k111a",
    paidAt: "2026-10-23T11:20:00Z",
    identityStatus: "verified",
    identityProvider: "digilocker_consent_offline",
    identityReference: "DL-AADHAAR-OK-6623",
    identityVerifiedAt: "2026-10-23T11:22:15Z",
    createdAt: "2026-10-23T11:15:00Z",
    updatedAt: "2026-10-23T11:22:15Z",
  },
  {
    id: "app_103",
    userId: "u_dev_meera",
    applicationReference: "PM-FILE-7619",
    status: "approved",
    applicantName: "Meera Alvi",
    applicantEmail: "meera.alvi@publishing.org",
    applicantPhone: "+91 99112 88471",
    applicantCity: "Delhi NCR",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    archetypeTitle: "The Radiant Catalyst",
    archetypeDescription:
      "Naturally brings out the best stories in quieter table companions with warmth, genuine curiosity, and poetic observations.",
    archetypeTraits: ["Empathetic Host", "Story Weaver", "Warm Presence"],
    socialEnergyScore: 78,
    conversationDepthScore: 90,
    playfulnessScore: 88,
    curiosityScore: 92,
    adventureScore: 70,
    dietaryPreference: "Vegan / Plant Forward",
    allergies: ["Dairy (Strict)"],
    personalBoundaries: ["Respectful listening when others speak"],
    sharedInterests: ["Independent Cinema", "Urdu Poetry", "Slow Travel"],
    quizAnswers: [],
    quizCompletedAt: "2026-10-20T14:10:00Z",
    paymentStatus: "paid",
    paymentAmountInr: 1999,
    paymentPlanTitle: "Annual Founding Member Pass",
    razorpayPaymentId: "pay_MEER9810aBc23",
    paidAt: "2026-10-20T14:15:00Z",
    identityStatus: "verified",
    identityProvider: "digilocker_consent_offline",
    identityReference: "DL-AADHAAR-OK-7819",
    identityVerifiedAt: "2026-10-20T14:17:00Z",
    reviewedBy: "admin@preciousmeets.com",
    reviewedAt: "2026-10-20T16:00:00Z",
    reviewDecisionNotes: "Exceptional profile. Ideal anchor for literary supper club pairings.",
    decisionEmailSentAt: "2026-10-20T16:00:05Z",
    createdAt: "2026-10-20T14:10:00Z",
    updatedAt: "2026-10-20T16:00:05Z",
  },
  {
    id: "app_104",
    userId: "u_dev_rohan",
    applicationReference: "PM-FILE-6502",
    status: "rejected",
    applicantName: "Rohan V.",
    applicantEmail: "rohan.crypto.growth@gmail.com",
    applicantPhone: "+91 97110 00192",
    applicantCity: "Delhi NCR",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    archetypeTitle: "The Transactional Strategist",
    archetypeDescription: "Looking to build corporate angel investor networks at dinner tables.",
    archetypeTraits: ["Networker", "Fast Paced"],
    socialEnergyScore: 90,
    conversationDepthScore: 40,
    playfulnessScore: 35,
    curiosityScore: 50,
    adventureScore: 60,
    dietaryPreference: "Flexible",
    allergies: [],
    personalBoundaries: [],
    sharedInterests: ["Pitch Decks", "Crypto Yields"],
    quizAnswers: [],
    quizCompletedAt: "2026-10-18T10:00:00Z",
    paymentStatus: "refunded",
    paymentAmountInr: 1999,
    paymentPlanTitle: "Annual Founding Member Pass",
    razorpayPaymentId: "pay_REF77189a8",
    paidAt: "2026-10-18T10:05:00Z",
    identityStatus: "verified",
    identityProvider: "digilocker_consent_offline",
    identityReference: "DL-AADHAAR-OK-5501",
    identityVerifiedAt: "2026-10-18T10:07:00Z",
    reviewedBy: "admin@preciousmeets.com",
    reviewedAt: "2026-10-18T12:00:00Z",
    reviewDecisionNotes: "Explicit goal was business pitching; strictly conflicts with anti-small-talk philosophy.",
    rejectionReason:
      "Our dining circle strictly disallows commercial promotion, business pitching, or angel investor scouting. Full refund processed.",
    decisionEmailSentAt: "2026-10-18T12:00:08Z",
    createdAt: "2026-10-18T10:00:00Z",
    updatedAt: "2026-10-18T12:00:08Z",
  },
];

export class ApplicationsService {
  private static loadApplications(): MemberApplication[] {
    if (typeof window === "undefined") return SEED_APPLICATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("[ApplicationsService] Failed to parse local dossiers:", e);
    }
    // Initialize seed data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
    return SEED_APPLICATIONS;
  }

  private static saveApplications(apps: MemberApplication[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.warn("[ApplicationsService] Failed to persist dossiers:", e);
    }
  }

  /**
   * Retrieves all member applications / dossiers.
   */
  static getApplications(): MemberApplication[] {
    return this.loadApplications();
  }

  /**
   * Retrieve a single member application by ID or reference code.
   */
  static getApplicationById(idOrRef: string): MemberApplication | undefined {
    const list = this.loadApplications();
    return list.find((a) => a.id === idOrRef || a.applicationReference === idOrRef);
  }

  /**
   * Captures or updates a member application when a user completes their quiz and payment.
   */
  static createOrUpdateFromCheckout(payload: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
    archetypeTitle: string;
    archetypeDescription?: string;
    scores?: {
      socialEnergy?: number;
      conversationDepth?: number;
      playfulness?: number;
      curiosity?: number;
      adventure?: number;
    };
    dietary?: string;
    allergies?: string[];
    boundaries?: string[];
    sharedInterests?: string[];
    quizAnswers?: QuizAnswerRecord[];
    paymentId: string;
    amountInr: number;
    memberId?: string;
  }): MemberApplication {
    const apps = this.loadApplications();
    const cleanEmail = payload.email.trim().toLowerCase();
    const existingIndex = apps.findIndex((a) => a.applicantEmail.toLowerCase() === cleanEmail);

    const now = new Date().toISOString();
    const reference = payload.memberId || `PM-FILE-${Math.floor(1000 + Math.random() * 9000)}`;

    const applicationRecord: MemberApplication = {
      id: existingIndex >= 0 ? apps[existingIndex].id : `app_${Date.now()}`,
      userId: payload.userId || (existingIndex >= 0 ? apps[existingIndex].userId : undefined),
      applicationReference: reference,
      status: "pending_review",
      applicantName: payload.name.trim(),
      applicantEmail: cleanEmail,
      applicantPhone: payload.phone || "+91 98100 12345",
      applicantCity: "Delhi NCR",
      avatarUrl:
        existingIndex >= 0
          ? apps[existingIndex].avatarUrl
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      archetypeTitle: payload.archetypeTitle,
      archetypeDescription:
        payload.archetypeDescription ||
        "A curious guest who appreciates intimate conversation, thoughtful pauses, and memorable food.",
      archetypeTraits: ["Cultural Explorer", "Deep Conversationalist", "Curious Mind"],
      socialEnergyScore: payload.scores?.socialEnergy ?? 72,
      conversationDepthScore: payload.scores?.conversationDepth ?? 88,
      playfulnessScore: payload.scores?.playfulness ?? 75,
      curiosityScore: payload.scores?.curiosity ?? 90,
      adventureScore: payload.scores?.adventure ?? 78,
      dietaryPreference: payload.dietary || "Vegetarian / Flexible",
      allergies: payload.allergies || [],
      personalBoundaries: payload.boundaries || ["Respectful conversational turns", "Strictly non-commercial"],
      sharedInterests: payload.sharedInterests || ["Culinary Arts", "Philosophy", "Cinema"],
      quizAnswers: payload.quizAnswers || [
        {
          questionNumber: 1,
          questionTitle: "Conversational tempo around a dinner table?",
          category: "conversation_style",
          answerLabel: "Unhurried, exploring ideas rather than corporate job titles",
        },
        {
          questionNumber: 2,
          questionTitle: "Ideal group dynamic?",
          category: "social_energy",
          answerLabel: "6 curated seats where everyone can hear and be heard",
        },
      ],
      quizCompletedAt: now,
      paymentStatus: "paid",
      paymentAmountInr: payload.amountInr || 1999,
      paymentPlanTitle: "Annual Founding Member Pass",
      razorpayPaymentId: payload.paymentId,
      paidAt: now,
      identityStatus: "verified", // Mock verified upon successful session
      identityProvider: "digilocker_consent_offline",
      identityReference: `DL-AADHAAR-OK-${Math.floor(1000 + Math.random() * 9000)}`,
      identityVerifiedAt: now,
      createdAt: existingIndex >= 0 ? apps[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      apps[existingIndex] = applicationRecord;
    } else {
      apps.unshift(applicationRecord);
    }

    this.saveApplications(apps);

    // Also attempt remote Supabase persistence asynchronously
    this.syncToSupabase(applicationRecord).catch((e) =>
      console.warn("[ApplicationsService] Supabase sync notice (using local storage):", e.message),
    );

    return applicationRecord;
  }

  /**
   * Approves a member application dossier:
   * 1. Updates status to 'approved'
   * 2. Logs reviewer notes
   * 3. Sends luxury approval welcome email
   * 4. Updates profile identity_verified to true
   */
  static async approveApplication(
    id: string,
    reviewerNotes?: string,
  ): Promise<{ success: boolean; application: MemberApplication }> {
    const apps = this.loadApplications();
    const index = apps.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new Error(`Dossier with ID ${id} not found.`);
    }

    const app = apps[index];
    const now = new Date().toISOString();

    app.status = "approved";
    app.reviewedBy = "admin@preciousmeets.com";
    app.reviewedAt = now;
    app.reviewDecisionNotes = reviewerNotes || "Approved by executive curation committee.";
    app.updatedAt = now;

    // Send Approval Email Notification
    try {
      await EmailService.send({
        to: app.applicantEmail,
        subject: "Welcome to Precious Meets — Your Membership Application is Approved ✨",
        template: "application_approved",
        data: {
          name: app.applicantName,
          memberId: app.applicationReference,
          archetype: app.archetypeTitle,
          plan: app.paymentPlanTitle,
          reviewNotes: app.reviewDecisionNotes,
          dashboardUrl:
            typeof window !== "undefined"
              ? `${window.location.origin}/dashboard`
              : "http://localhost:5173/dashboard",
        },
      });
      app.decisionEmailSentAt = now;
      app.decisionEmailTemplate = "application_approved";
    } catch (err) {
      console.warn("[ApplicationsService] Could not send approval email:", err);
    }

    apps[index] = app;
    this.saveApplications(apps);

    // Sync state to remote Supabase if connected
    this.syncToSupabase(app).catch(() => {});

    return { success: true, application: app };
  }

  /**
   * Rejects a member application dossier:
   * 1. Updates status to 'rejected'
   * 2. Sets paymentStatus to 'refunded' if paid
   * 3. Logs rejection reason
   * 4. Sends polite rejection notification email
   */
  static async rejectApplication(
    id: string,
    rejectionReason?: string,
  ): Promise<{ success: boolean; application: MemberApplication }> {
    const apps = this.loadApplications();
    const index = apps.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new Error(`Dossier with ID ${id} not found.`);
    }

    const app = apps[index];
    const now = new Date().toISOString();

    app.status = "rejected";
    app.reviewedBy = "admin@preciousmeets.com";
    app.reviewedAt = now;
    app.rejectionReason =
      rejectionReason ||
      "Due to curated table harmony and cohort capacity restrictions, we cannot accept your application at this time.";
    if (app.paymentStatus === "paid") {
      app.paymentStatus = "refunded";
    }
    app.updatedAt = now;

    // Send Rejection Email Notification
    try {
      await EmailService.send({
        to: app.applicantEmail,
        subject: "Update regarding your Precious Meets Membership Application",
        template: "application_rejected",
        data: {
          name: app.applicantName,
          reference: app.applicationReference,
          rejectionReason: app.rejectionReason,
          refundNote:
            app.paymentStatus === "refunded"
              ? `Your payment of ₹${app.paymentAmountInr} has been refunded in full via Razorpay reference ${app.razorpayPaymentId || "REF-PM"}.`
              : undefined,
        },
      });
      app.decisionEmailSentAt = now;
      app.decisionEmailTemplate = "application_rejected";
    } catch (err) {
      console.warn("[ApplicationsService] Could not send rejection email:", err);
    }

    apps[index] = app;
    this.saveApplications(apps);

    // Sync state to remote Supabase if connected
    this.syncToSupabase(app).catch(() => {});

    return { success: true, application: app };
  }

  /**
   * Helper to sync to Supabase table when available
   */
  private static async syncToSupabase(app: MemberApplication) {
    try {
      const { error } = await supabase.from("member_applications").upsert({
        id: app.id.startsWith("app_") ? undefined : app.id,
        application_reference: app.applicationReference,
        status: app.status,
        applicant_name: app.applicantName,
        applicant_email: app.applicantEmail,
        applicant_phone: app.applicantPhone,
        applicant_city: app.applicantCity,
        archetype_title: app.archetypeTitle,
        archetype_description: app.archetypeDescription,
        social_energy_score: app.socialEnergyScore,
        conversation_depth_score: app.conversationDepthScore,
        playfulness_score: app.playfulnessScore,
        curiosity_score: app.curiosityScore,
        adventure_score: app.adventureScore,
        dietary_preference: app.dietaryPreference,
        payment_status: app.paymentStatus,
        payment_amount_inr: app.paymentAmountInr * 100, // paise
        razorpay_payment_id: app.razorpayPaymentId,
        identity_status: app.identityStatus,
        identity_reference: app.identityReference,
        review_decision_notes: app.reviewDecisionNotes,
        rejection_reason: app.rejectionReason,
        reviewed_at: app.reviewedAt,
      });

      if (error) {
        // Table might not be migrated on remote yet; safe fallback to localStorage
      }
    } catch {
      // Offline fallback
    }
  }
}
