import { ApplicationsService } from "./applications-service";

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
}

const STORAGE_KEY = "precious_meets_verification_queue_v1";

export class VerificationsService {
  /**
   * Asynchronously synchronizes the verification queue with the server data file
   * (/api/verifications). Ensures records created in regular sessions are immediately visible
   * in incognito sessions, other tabs, and across devices.
   */
  static async fetchQueueFromServer(): Promise<VerificationRecord[]> {
    if (typeof window === "undefined") return this.getQueue();
    try {
      const res = await fetch("/api/verifications");
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.data)) {
          const serverList: VerificationRecord[] = json.data;
          let storedList: VerificationRecord[] = [];
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) storedList = JSON.parse(raw);
          } catch (e) {}

          const map = new Map<string, VerificationRecord>();
          serverList.forEach((s) => {
            if (s.email) map.set(s.email.toLowerCase(), s);
          });
          if (Array.isArray(storedList)) {
            storedList.forEach((l) => {
              if (l.email) {
                const s = map.get(l.email.toLowerCase());
                if (s) {
                  map.set(l.email.toLowerCase(), {
                    ...s,
                    ...l,
                    aadhaarFileUrl: l.aadhaarFileUrl || s.aadhaarFileUrl,
                    aadhaarFileName: l.aadhaarFileName || s.aadhaarFileName,
                  });
                } else {
                  map.set(l.email.toLowerCase(), l);
                }
              }
            });
          }

          const merged = Array.from(map.values());
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            // quota safe
          }
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("precious_meets_verification_updated"));
          return this.getQueue();
        }
      }
    } catch (err) {
      console.warn("[VerificationsService] Server sync notice:", err);
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

    // 2. Unify all paid member applications from ApplicationsService
    try {
      const apps = ApplicationsService.getApplications();
      apps.forEach((app) => {
        const cleanEmail = app.applicantEmail?.toLowerCase().trim();
        if (!cleanEmail) return;

        const isApproved = app.identityStatus === "verified" || app.status === "approved";
        const isFailed = app.identityStatus === "failed" || app.status === "rejected";
        const queueStatus: VerificationRecord["status"] = isApproved
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
            notes: `Annual Founding Member Pass (₹${app.paymentAmountInr || 1999} Razorpay Payment: ${app.razorpayPaymentId || "Paid"}). Archetype: ${app.archetypeTitle}${app.aadhaarFileName ? ` | Aadhaar Doc: ${app.aadhaarFileName}` : ""}`,
            amountInr: app.paymentAmountInr || 1999,
            memberId: app.applicationReference.replace("PM-FILE-", "PM-FOUNDER-"),
            aadhaarFileUrl: app.aadhaarFileUrl,
            aadhaarFileName: app.aadhaarFileName,
          });
        } else {
          // If already in queue, make sure aadhaar file is synced if missing
          const existing = unified.find((u) => u.email.toLowerCase() === cleanEmail);
          if (existing) {
            if (!existing.aadhaarFileUrl && app.aadhaarFileUrl) {
              existing.aadhaarFileUrl = app.aadhaarFileUrl;
              existing.aadhaarFileName = app.aadhaarFileName;
            }
            if (isApproved && existing.status !== "verified") {
              existing.status = "verified";
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
      method: data.method || (data.aadhaarFileUrl ? "aadhaar_card_upload" : "digilocker_consent_offline"),
      status: "pending",
      requestedAt: `Today, ${formattedTime}`,
      notes: data.notes || "Annual Founding Member (₹1,999) - Verification request submitted",
      amountInr: data.amountInr || 1999,
      memberId: data.memberId,
      aadhaarFileUrl: data.aadhaarFileUrl,
      aadhaarFileName: data.aadhaarFileName,
    };

    // Place at front of queue so it appears first in the admin table
    const updated = [newRecord, ...queue.filter((q) => q.email?.toLowerCase() !== data.email.toLowerCase())];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("[VerificationsService] LocalStorage quota hit, saving optimized queue:", e);
      // Strip oversized base64 to ensure the user record is never dropped
      const safeUpdated = updated.map((item) => ({
        ...item,
        aadhaarFileUrl: item.aadhaarFileUrl && item.aadhaarFileUrl.length > 50000 ? item.aadhaarFileUrl.slice(0, 50000) : item.aadhaarFileUrl,
      }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUpdated));
      } catch (e2) {
        const minimal = updated.map((item) => ({ ...item, aadhaarFileUrl: undefined }));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
        } catch (e3) {}
      }
    }

    // Dispatch storage and verification events
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("precious_meets_verification_updated", {
        detail: newRecord,
      })
    );

    // Sync to server API so other tabs and incognito sessions receive it instantly
    if (typeof window !== "undefined") {
      fetch("/api/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      }).catch((e) => console.warn("[VerificationsService] Server POST error:", e));
    }

    return newRecord;
  }

  /**
   * Updates status of an item in the queue (e.g. verified or failed)
   * and synchronizes with ApplicationsService to update the member dossier.
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

    // Synchronize with ApplicationsService dossier
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
    } catch (err) {
      console.warn("[VerificationsService] Applications sync notice:", err);
    }

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("precious_meets_verification_updated", {
        detail: { id, status },
      })
    );
    window.dispatchEvent(new CustomEvent("precious_meets_applications_updated"));

    // Sync full updated queue to server API
    if (typeof window !== "undefined") {
      fetch("/api/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).catch((e) => console.warn("[VerificationsService] Server POST updated error:", e));
    }

    return updated;
  }

  /**
   * Permanently deletes a verification request and its associated member application dossier
   * across local storage, server files, and remote database.
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

    // 2. Cascade delete to ApplicationsService
    try {
      if (cleanEmail) {
        ApplicationsService.deleteApplication(cleanEmail);
      }
      ApplicationsService.deleteApplication(cleanId);
    } catch (e) {
      console.warn("[VerificationsService] ApplicationsService cascade notice:", e);
    }

    // 3. Call server DELETE endpoint
    if (typeof window !== "undefined") {
      const query = new URLSearchParams();
      if (id) query.set("id", id);
      if (email) query.set("email", email);
      fetch(`/api/verifications?${query.toString()}`, {
        method: "DELETE",
      }).catch((e) => console.warn("[VerificationsService] Server DELETE error:", e));
    }

    // 4. Update memory queue
    const updated = queue.filter(
      (item) =>
        item.id.toLowerCase() !== cleanId &&
        (!cleanEmail || item.email?.toLowerCase() !== cleanEmail)
    );

    // 5. Notify all listeners
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("precious_meets_verification_updated"));
    window.dispatchEvent(new CustomEvent("precious_meets_applications_updated"));

    return updated;
  }
}
