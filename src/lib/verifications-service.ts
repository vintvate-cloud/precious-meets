import { ApplicationsService } from "./applications-service";
import { supabase } from "./supabase";

export interface VerificationRecord {
  id: string;
  userName: string;
  email: string;
  phone?: string | undefined;
  city?: string | undefined;
  avatar?: string | undefined;
  method: string;
  status: "pending" | "manual_review" | "verified" | "failed";
  requestedAt: string;
  notes?: string | undefined;
  amountInr?: number | undefined;
  memberId?: string | undefined;
  aadhaarFileUrl?: string | undefined;
  aadhaarFileName?: string | undefined;
  userPhotoUrl?: string | undefined;
  userPhotoFileName?: string | undefined;
  instagram?: string | undefined;
  linkedin?: string | undefined;
}

const STORAGE_KEY = "precious_meets_verification_queue_v1";

export class VerificationsService {
  /**
   * Synchronizes verification queue directly with Supabase via ApplicationsService.
   */
  static async fetchQueueFromServer(): Promise<VerificationRecord[]> {
    if (typeof window === "undefined") return this.getQueue();
    try {
      await ApplicationsService.fetchApplicationsFromDb();
    } catch (err) {
      console.warn("[VerificationsService] Database sync notice:", err);
    }
    return this.getQueue();
  }

  /**
   * Retrieves current verification queue by unifying stored queue with
   * all real member applications that completed checkout & payment.
   */
  static getQueue(): VerificationRecord[] {
    if (typeof window === "undefined") return [];

    let storedList: VerificationRecord[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Purge legacy mock records
          storedList = parsed.filter(
            (v: VerificationRecord) =>
              !v.id.startsWith("ver_01") &&
              !v.id.startsWith("ver_02") &&
              !v.email?.endsWith("@example.com"),
          );
        }
      }
    } catch (e) {
      console.warn("[VerificationsService] Failed to parse verification queue:", e);
    }

    const seenEmails = new Set<string>();
    const unified: VerificationRecord[] = [];

    // 1. Add stored queue items first
    storedList.forEach((q) => {
      if (q.email && !seenEmails.has(q.email.toLowerCase())) {
        seenEmails.add(q.email.toLowerCase());
        unified.push(q);
      }
    });

    // 2. Unify all paid member applications from ApplicationsService (loaded from Supabase)
    try {
      const apps = ApplicationsService.getApplications();
      apps.forEach((app) => {
        const cleanEmail = app.applicantEmail?.toLowerCase().trim();
        if (!cleanEmail) return;

        const isApproved = app.identityStatus === "verified" || app.status === "approved";
        const isFailed = app.identityStatus === "failed" || app.status === "rejected";
        const isReuploaded = app.identityStatus === "reuploaded";
        const queueStatus: VerificationRecord["status"] = isReuploaded
          ? "manual_review"
          : isApproved
          ? "verified"
          : isFailed
          ? "failed"
          : "pending";

        if (!seenEmails.has(cleanEmail)) {
          seenEmails.add(cleanEmail);
          unified.push({
            id: `ver_${app.id}`,
            userName: app.applicantName,
            email: app.applicantEmail,
            phone: app.applicantPhone || "+91 98765 43210",
            city: app.applicantCity || "Delhi NCR",
            avatar:
              app.userPhotoUrl ||
              app.avatarUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            method: app.aadhaarFileUrl ? "aadhaar_card_upload" : "digilocker_consent_offline",
            status: queueStatus,
            requestedAt: app.paidAt
              ? `Today, ${new Date(app.paidAt).toLocaleTimeString("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}`
              : "Recently",
            notes: isReuploaded
              ? `★ RE-UPLOADED: Member uploaded revised document (${app.aadhaarFileName || "Document"}). Archetype: ${app.archetypeTitle}`
              : `Precious Meets Membership (₹${app.paymentAmountInr || 1999} Razorpay Payment: ${app.razorpayPaymentId || "Paid"}). Archetype: ${app.archetypeTitle}${app.aadhaarFileName ? ` | Aadhaar Doc: ${app.aadhaarFileName}` : ""}`,
            amountInr: app.paymentAmountInr || 1999,
            memberId: app.applicationReference.replace("PM-FILE-", "PM-"),
            aadhaarFileUrl: app.aadhaarFileUrl,
            aadhaarFileName: app.aadhaarFileName,
            userPhotoUrl: app.userPhotoUrl || app.avatarUrl,
            userPhotoFileName: app.userPhotoFileName,
            instagram: app.applicantInstagram,
            linkedin: app.applicantLinkedin,
          });
        } else {
          // If already in queue, update with newly re-uploaded Aadhaar file
          const existing = unified.find((u) => u.email.toLowerCase() === cleanEmail);
          if (existing) {
            if (app.aadhaarFileUrl) {
              existing.aadhaarFileUrl = app.aadhaarFileUrl;
              existing.aadhaarFileName = app.aadhaarFileName;
              existing.method = "aadhaar_card_upload";
            }
            if (!existing.userPhotoUrl && (app.userPhotoUrl || app.avatarUrl)) {
              existing.userPhotoUrl = app.userPhotoUrl || app.avatarUrl;
              existing.userPhotoFileName = app.userPhotoFileName;
              existing.avatar = app.userPhotoUrl || app.avatarUrl;
            }
            if (app.applicantInstagram) existing.instagram = app.applicantInstagram;
            if (app.applicantLinkedin) existing.linkedin = app.applicantLinkedin;
            if (app.identityStatus === "reuploaded") {
              existing.status = "manual_review";
              existing.notes = `★ RE-UPLOADED: Member uploaded revised document (${app.aadhaarFileName || "Document"})`;
            } else if (isApproved && existing.status !== "verified") {
              existing.status = "verified";
            } else if (isFailed && existing.status !== "failed") {
              existing.status = "failed";
            }
          }
        }
      });
    } catch (e) {
      console.warn("[VerificationsService] Applications merge notice:", e);
    }

    return unified;
  }

  /**
   * Adds a new verification request directly into the admin verification queue
   */
  static addRequest(data: {
    userName: string;
    email: string;
    phone?: string | undefined;
    city?: string | undefined;
    avatar?: string | undefined;
    method?: string | undefined;
    notes?: string | undefined;
    amountInr?: number | undefined;
    memberId?: string | undefined;
    aadhaarFileUrl?: string | undefined;
    aadhaarFileName?: string | undefined;
    userPhotoUrl?: string | undefined;
    userPhotoFileName?: string | undefined;
    instagram?: string | undefined;
    linkedin?: string | undefined;
  }): VerificationRecord {
    const queue = this.getQueue();
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const newRecord: VerificationRecord = {
      id: `ver_${Date.now()}`,
      userName: data.userName,
      email: data.email,
      phone: data.phone || "+91 98765 43210",
      city: data.city || "Delhi NCR",
      avatar:
        data.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      method: data.method || "digilocker_consent_offline",
      status: "pending",
      requestedAt: `Today, ${formattedTime}`,
      notes: data.notes || "Precious Meets Membership (₹1,999 Razorpay Payment Received)",
      amountInr: data.amountInr || 1999,
      memberId: data.memberId || `PM-${Math.floor(1000 + Math.random() * 9000)}`,
      aadhaarFileUrl: data.aadhaarFileUrl,
      aadhaarFileName: data.aadhaarFileName,
      userPhotoUrl: data.userPhotoUrl,
      userPhotoFileName: data.userPhotoFileName,
      instagram: data.instagram,
      linkedin: data.linkedin,
    };

    // Prepend to avoid duplicates
    const updated = [
      newRecord,
      ...queue.filter((q) => q.email.toLowerCase() !== data.email.toLowerCase()),
    ];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("[VerificationsService] Storage quota notice:", e);
    }

    // Dispatch storage and verification events
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("precious_meets_verification_updated", {
          detail: newRecord,
        })
      );
    }

    return newRecord;
  }

  /**
   * Updates status of an item in the queue (e.g. verified or failed)
   * and synchronizes with ApplicationsService & Supabase to update the member dossier.
   */
  static updateStatus(
    id: string,
    status: "verified" | "failed" | "manual_review" | "pending"
  ): VerificationRecord[] {
    const queue = this.getQueue();
    const targetItem = queue.find((item) => item.id === id);
    const updated = queue.map((item) =>
      item.id === id ? { ...item, status } : item
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      const minimal = updated.map((item) => ({
        ...item,
        aadhaarFileUrl: item.aadhaarFileUrl && item.aadhaarFileUrl.length > 50000 ? item.aadhaarFileUrl.slice(0, 50000) : item.aadhaarFileUrl,
      }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
      } catch (e2) {}
    }

    // Synchronize with ApplicationsService & Supabase
    try {
      const cleanId = id.replace("ver_", "");
      const apps = ApplicationsService.getApplications();
      const matchingApp = apps.find(
        (a) =>
          a.id === cleanId ||
          a.id === id ||
          (targetItem && a.applicantEmail.toLowerCase() === targetItem.email.toLowerCase())
      );

      if (matchingApp) {
        if (status === "verified") {
          ApplicationsService.approveApplication(
            matchingApp.id,
            "Aadhaar Identity verified by Administrator.",
          ).catch(() => {});
        } else if (status === "failed") {
          ApplicationsService.rejectApplication(
            matchingApp.id,
            "Aadhaar identity documentation could not be validated.",
          ).catch(() => {});
        }
      }

      // Also update identity_status in Supabase
      if (targetItem && targetItem.email) {
        supabase
          .from("member_applications")
          .update({
            identity_status: status === "verified" ? "verified" : status === "failed" ? "failed" : "pending",
            identity_verified_at: status === "verified" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("applicant_email", targetItem.email.toLowerCase())
          .then(
            () => {},
            (err: any) => console.warn("[VerificationsService] Supabase identity status update notice:", err)
          );
      }
    } catch (err) {
      console.warn("[VerificationsService] Applications sync notice:", err);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("precious_meets_verification_updated", {
          detail: { id, status },
        })
      );
      window.dispatchEvent(new CustomEvent("precious_meets_applications_updated"));
    }

    return updated;
  }

  /**
   * Permanently deletes a verification request and its associated member application dossier
   * across local storage and remote Supabase database.
   */
  static deleteRecord(id: string, email?: string): VerificationRecord[] {
    const queue = this.getQueue();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanId = id.trim().toLowerCase();

    // 1. Remove from local storage queue
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const storedList = parsed.filter(
            (v: VerificationRecord) =>
              v.id.toLowerCase() !== cleanId &&
              (!cleanEmail || v.email?.toLowerCase() !== cleanEmail)
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(storedList));
        }
      }
    } catch (e) {
      console.warn("[VerificationsService] Local storage removal error:", e);
    }

    // 2. Cascade delete to ApplicationsService (which deletes from Supabase)
    try {
      if (cleanEmail) {
        ApplicationsService.deleteApplication(cleanEmail);
      }
      ApplicationsService.deleteApplication(cleanId);
    } catch (e) {
      console.warn("[VerificationsService] ApplicationsService cascade notice:", e);
    }

    // 3. Update memory queue
    const updated = queue.filter(
      (item) =>
        item.id.toLowerCase() !== cleanId &&
        (!cleanEmail || item.email?.toLowerCase() !== cleanEmail)
    );

    // 4. Notify all listeners
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("precious_meets_verification_updated"));
      window.dispatchEvent(new CustomEvent("precious_meets_applications_updated"));
    }

    return updated;
  }

  /**
   * Directly syncs a newly re-uploaded Aadhaar card into the verifications queue
   */
  static syncReuploadedAadhaar(email: string, fileUrl: string, fileName: string): void {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: VerificationRecord[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      const idx = list.findIndex((v) => v.email?.trim().toLowerCase() === cleanEmail);
      if (idx !== -1) {
        const item = list[idx];
        if (item) {
          item.aadhaarFileUrl = fileUrl;
          item.aadhaarFileName = fileName;
          item.status = "manual_review";
          item.method = "aadhaar_card_upload";
          item.notes = `★ RE-UPLOADED: Member uploaded revised document (${fileName || "Document"})`;
          item.requestedAt = "Just now (Re-uploaded)";
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }
      }
    } catch (e) {
      console.warn("[VerificationsService] syncReuploadedAadhaar local storage notice:", e);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("precious_meets_verification_updated"));
    }
  }
}
