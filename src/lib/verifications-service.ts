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
}

const STORAGE_KEY = "precious_meets_verification_queue_v1";

const INITIAL_QUEUE: VerificationRecord[] = [];

export class VerificationsService {
  /**
   * Retrieves current verification queue from localStorage (strictly real submissions)
   */
  static getQueue(): VerificationRecord[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Purge any legacy mock records from old seed data
          const realQueue = parsed.filter(
            (v: VerificationRecord) =>
              !v.id.startsWith("ver_01") &&
              !v.id.startsWith("ver_02") &&
              !v.email?.endsWith("@example.com"),
          );
          if (realQueue.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(realQueue));
          }
          return realQueue;
        }
      }
    } catch (e) {
      console.warn("[VerificationsService] Failed to parse verification queue:", e);
    }
    return [];
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
      notes: data.notes || "Annual Founding Member (₹1,999) - Verification request submitted",
      amountInr: data.amountInr || 1999,
      memberId: data.memberId,
    };

    // Place at front of queue so it appears first in the admin table
    const updated = [newRecord, ...queue.filter((q) => q.email !== data.email)];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch storage event to alert open admin tabs
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("precious_meets_verification_updated", {
          detail: newRecord,
        })
      );
    } catch (e) {
      console.warn("[VerificationsService] Failed to persist queue:", e);
    }

    return newRecord;
  }

  /**
   * Updates status of an item in the queue (e.g. verified or failed)
   */
  static updateStatus(
    id: string,
    status: "verified" | "failed" | "manual_review" | "pending"
  ): VerificationRecord[] {
    const queue = this.getQueue();
    const updated = queue.map((item) =>
      item.id === id ? { ...item, status } : item
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("precious_meets_verification_updated", {
          detail: { id, status },
        })
      );
    } catch (e) {
      console.warn("[VerificationsService] Failed to update status:", e);
    }

    return updated;
  }
}
