import { getSupabaseAdmin, supabase } from "./supabase";

export type IdentityStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "failed"
  | "expired"
  | "manual_review";

export interface VerificationSessionRequest {
  userId: string;
  userEmail: string;
  fullName: string;
  consentGiven: boolean;
  consentTimestamp: string;
  returnUrl: string;
}

export interface VerificationSessionResponse {
  sessionId: string;
  providerUrl: string;
  status: IdentityStatus;
  expiresAt: string;
  isMock: boolean;
}

export class IdentityVerificationService {
  private static isMockMode(): boolean {
    const envVal =
      (typeof process !== "undefined" && process.env?.IDENTITY_VERIFICATION_MOCK_MODE) ||
      (import.meta as any).env?.VITE_IDENTITY_VERIFICATION_MOCK_MODE;
    return envVal !== "false";
  }

  /**
   * Initializes a legally permitted consent-driven verification session.
   * Explicit consent is required by UIDAI / DigiLocker guidelines.
   */
  static async createVerificationSession(
    req: VerificationSessionRequest,
  ): Promise<VerificationSessionResponse> {
    if (!req.consentGiven) {
      throw new Error("Explicit user consent is legally required before initiating verification.");
    }

    const sessionId = `ver_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry
    const isMock = this.isMockMode();

    const admin = getSupabaseAdmin();

    // Record verification intent in DB audit
    await admin.from("identity_verifications").insert({
      user_id: req.userId,
      provider: isMock ? "sandbox_consent_provider" : "digilocker_authorized_partner",
      provider_reference: sessionId,
      verification_method: "digilocker_consent_offline",
      consent_obtained_at: req.consentTimestamp,
      status: "pending",
      expires_at: expiresAt,
    });

    // Update profile to pending
    await admin
      .from("profiles")
      .update({ identity_status: "pending" })
      .eq("id", req.userId);

    const providerUrl = isMock
      ? `/verify-identity?session_id=${sessionId}&mock_mode=1`
      : `${process.env.IDENTITY_PROVIDER_BASE_URL}/oauth/authorize?client_id=${process.env.IDENTITY_PROVIDER_CLIENT_ID}&session_id=${sessionId}&redirect_uri=${encodeURIComponent(req.returnUrl)}`;

    return {
      sessionId,
      providerUrl,
      status: "pending",
      expiresAt,
      isMock,
    };
  }

  /**
   * Completes the verification after provider callback.
   * Strictly avoids storing raw Aadhaar, biometrics, or unmasked documents.
   */
  static async processProviderCallback(
    sessionId: string,
    providerStatus: "success" | "failure" | "manual_review",
    reason?: string,
  ): Promise<{ status: IdentityStatus; message: string }> {
    const admin = getSupabaseAdmin();

    const { data: record, error } = await admin
      .from("identity_verifications")
      .select("*")
      .eq("provider_reference", sessionId)
      .single();

    if (error || !record) {
      throw new Error("Verification session reference not found or expired.");
    }

    let finalStatus: IdentityStatus = "failed";
    if (providerStatus === "success") {
      finalStatus = "verified";
    } else if (providerStatus === "manual_review") {
      finalStatus = "manual_review";
    }

    // Update verification record with timestamp & minimal status
    await admin
      .from("identity_verifications")
      .update({
        status: finalStatus,
        verified_at: finalStatus === "verified" ? new Date().toISOString() : null,
        failure_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    // Update user profile status
    await admin
      .from("profiles")
      .update({
        identity_verified: finalStatus === "verified",
        identity_status: finalStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.user_id);

    return {
      status: finalStatus,
      message:
        finalStatus === "verified"
          ? "Identity successfully verified via authorized offline consent."
          : "Verification could not be confirmed. Manual review has been scheduled.",
    };
  }
}
