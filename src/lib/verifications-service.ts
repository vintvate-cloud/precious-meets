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

const INITIAL_QUEUE: VerificationRecord[] = [
  {
    id: "ver_01",
    userName: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "+91 98210 77651",
    city: "Delhi NCR",
    method: "digilocker_consent_offline",
    status: "pending",
    requestedAt: "Today, 2:15 PM",
    notes: "Aadhaar offline XML match pending reviewer clearance",
  },
  {
    id: "ver_02",
    userName: "Vikram Sengupta",
    email: "vikram.s@example.com",
    phone: "+91 98101 44521",
    city: "Delhi NCR",
    method: "digilocker_consent_offline",
    status: "manual_review",
    requestedAt: "Yesterday, 6:40 PM",
    notes: "Document photo clarity check required",
  },
];

export class VerificationsService {
  /**
   * Retrieves current verification queue from localStorage
   */
  static getQueue(): VerificationRecord[] {
    if (typeof window === "undefined") return INITIAL_QUEUE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("[VerificationsService] Failed to parse verification queue:", e);
    }
    // Initialize default seed queue if not present
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_QUEUE));
    return INITIAL_QUEUE;
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
