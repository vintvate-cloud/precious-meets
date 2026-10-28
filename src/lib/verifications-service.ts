import { ApplicationsService } from "./applications-service";
import { EventsService } from "./events-service";
import { supabase } from "./supabase";
import { isDeletedUser, recordDeletedUser } from "./deleted-users";

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
  requestedAtExact?: string | undefined;
  requestedAtIso?: string | undefined;
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

/**
 * Formats the real applicant submission / payment timestamp into a relative display
 * ("Today, 5:53 pm", "Yesterday, 11:02 pm", "27 Oct, 1:14 am") along with exact date & time.
 */
export function formatRealRequestedTime(
  timestampOrIso?: string | number | Date | null
): { display: string; exact: string } {
  if (!timestampOrIso) {
    return { display: "Recently", exact: "Time not recorded" };
  }

  let date: Date;
  if (timestampOrIso instanceof Date) {
    date = timestampOrIso;
  } else if (typeof timestampOrIso === "number") {
    date = new Date(timestampOrIso);
  } else {
    const raw = String(timestampOrIso).trim();
    const parsed = Date.parse(raw);
    if (!isNaN(parsed)) {
      date = new Date(parsed);
    } else {
      return { display: raw, exact: raw };
    }
  }

  if (isNaN(date.getTime())) {
    return { display: String(timestampOrIso), exact: "" };
  }

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  let display: string;
  if (isToday) {
    display = `Today, ${timeStr}`;
  } else if (isYesterday) {
    display = `Yesterday, ${timeStr}`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleDateString("en-IN", { month: "short" });
    const year = date.getFullYear() !== now.getFullYear() ? ` ${date.getFullYear()}` : "";
    display = `${day} ${month}${year}, ${timeStr}`;
  }

  const exact =
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + ` • ${timeStr}`;

  return { display, exact };
}

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
          // Purge legacy mock records and deleted users
          storedList = parsed.filter(
            (v: VerificationRecord) =>
              !v.id.startsWith("ver_01") &&
              !v.id.startsWith("ver_02") &&
              !v.email?.endsWith("@example.com") &&
              !isDeletedUser(v.email, v.id),
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
        // If exact time wasn't formatted yet, try to derive from existing data
        if (!q.requestedAtExact) {
          const formatted = formatRealRequestedTime(q.requestedAtIso || q.requestedAt);
          q.requestedAtExact = formatted.exact;
          if (q.requestedAtIso) {
            q.requestedAt = formatted.display;
          }
        }
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

        // Determine real applicant request timestamp
        const realTimestamp =
          (isReuploaded ? app.aadhaarReuploadedAt : undefined) ||
          app.paidAt ||
          app.createdAt ||
          app.quizCompletedAt ||
          app.updatedAt;

        const timeInfo = formatRealRequestedTime(realTimestamp);
        const displayTime = isReuploaded ? `Re-uploaded • ${timeInfo.display}` : timeInfo.display;

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
            requestedAt: displayTime,
            requestedAtExact: timeInfo.exact,
            requestedAtIso: realTimestamp,
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
          // If already in queue, update with newly re-uploaded Aadhaar file and real time
          const existing = unified.find((u) => u.email.toLowerCase() === cleanEmail);
          if (existing) {
            // Update real time from database application
            if (realTimestamp) {
              existing.requestedAtIso = realTimestamp;
              existing.requestedAtExact = timeInfo.exact;
              existing.requestedAt = displayTime;
            }
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

    return unified.filter((item) => !isDeletedUser(item.email, item.id));
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
    requestedAtIso?: string | undefined;
  }): VerificationRecord {
    const queue = this.getQueue();
    const isoTime = data.requestedAtIso || new Date().toISOString();
    const timeInfo = formatRealRequestedTime(isoTime);

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
      requestedAt: timeInfo.display,
      requestedAtExact: timeInfo.exact,
      requestedAtIso: isoTime,
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
   * across local storage, attendees pool, and remote Supabase database.
   */
  static deleteRecord(id: string, email?: string): VerificationRecord[] {
    const queue = this.getQueue();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanId = id.trim().toLowerCase();
    const rawId = cleanId.replace(/^ver_/, "");

    // Find in queue if email was not supplied
    const existing = queue.find(
      (q) =>
        q.id.toLowerCase() === cleanId ||
        q.id.toLowerCase() === rawId ||
        (cleanEmail && q.email?.toLowerCase() === cleanEmail)
    );
    const effectiveEmail = cleanEmail || existing?.email?.trim().toLowerCase();
    const effectiveMemberId = existing?.memberId;

    // 0. Register in deleted users blacklist immediately
    recordDeletedUser(effectiveEmail, cleanId, effectiveMemberId);

    // 1. Remove from local storage queue
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const storedList = parsed.filter(
            (v: VerificationRecord) =>
              v.id.toLowerCase() !== cleanId &&
              v.id.toLowerCase() !== rawId &&
              (!effectiveEmail || v.email?.toLowerCase() !== effectiveEmail) &&
              !isDeletedUser(v.email, v.id)
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(storedList));
        }
      }
    } catch (e) {
      console.warn("[VerificationsService] Local storage removal error:", e);
    }

    // 2. Cascade delete to ApplicationsService (which deletes from Supabase & soft deletes)
    try {
      ApplicationsService.deleteApplication(cleanId, effectiveEmail);
    } catch (e) {
      console.warn("[VerificationsService] ApplicationsService cascade notice:", e);
    }

    // 3. Cascade delete to EventsService (removes from Attendees and unseats from all tables)
    try {
      EventsService.deleteAttendee(cleanId, effectiveEmail);
    } catch (e) {
      console.warn("[VerificationsService] EventsService cascade notice:", e);
    }

    // 4. Update memory queue
    const updated = queue.filter(
      (item) =>
        item.id.toLowerCase() !== cleanId &&
        item.id.toLowerCase() !== rawId &&
        (!effectiveEmail || item.email?.toLowerCase() !== effectiveEmail) &&
        !isDeletedUser(item.email, item.id)
    );

    // 5. Notify all listeners
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("precious_meets_verification_updated"));
      window.dispatchEvent(new CustomEvent("precious_meets_applications_updated"));
      window.dispatchEvent(new CustomEvent("precious_meets_attendees_updated"));
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
