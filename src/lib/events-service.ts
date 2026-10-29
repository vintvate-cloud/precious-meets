import { EmailService } from "@/lib/email-service";
import { ApplicationsService } from "./applications-service";
import { supabase } from "@/lib/supabase";
import { isDeletedUser, recordDeletedUser } from "@/lib/deleted-users";

export interface AdminAttendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  gender: "female" | "male" | "non-binary";
  archetype: {
    title: string;
    description: string;
    dimensions: {
      socialEnergy: number;
      conversationDepth: number;
      curiosity: number;
      adventure: number;
    };
  };
  dietary: string;
  allergies: string[];
  identityVerified: boolean;
  memberTier: string;
  memberId: string;
}

export interface AdminEvent {
  id: string;
  slug: string;
  title: string;
  city: "Delhi NCR";
  neighborhood: string;
  venueName: string;
  venueAddress: string;
  secretAccessCode: string;
  startsAt: string; // ISO string
  endsAt: string;   // ISO string
  dateDisplay: string;
  priceInr: number;
  category: "supper_club" | "coffee_tasting" | "after_dark" | "salon";
  hostName: string;
  hostRole: string;
  hostAvatar?: string;
  coverImage: string;
  theme: string;
  menuPreview: string[];
  dietaryOptions: string[];
  status: "draft" | "published" | "completed" | "cancelled";
  seats: (string | null)[]; // 6 slots: index 0 to 5 containing Attendee IDs
  emailsSentAt?: string | null;
  notes?: string;
  checkIns?: Record<string, EventCheckIn>; // Keyed by attendeeId
  seatAcceptances?: Record<string, SeatAcceptance>; // Keyed by attendeeId
}

export interface SeatAcceptance {
  attendeeId: string;
  attendeeEmail?: string;
  attendeeName?: string;
  seatNumber: number; // 1 to 6
  status: "pending" | "accepted" | "declined";
  invitedAt: string;
  respondedAt?: string;
  declineReason?: string;
  emailSent?: boolean;
  emailSentAt?: string;
}

export interface EventCheckIn {
  attendeeId: string;
  attendeeName: string;
  memberId: string;
  seatNumber: number; // 1 to 6
  checkedInAt: string; // ISO string
}

export interface UserSeatInvitation {
  id: string;
  eventId: string;
  eventTitle: string;
  attendeeId?: string;
  attendeeEmail?: string;
  city: string;
  neighborhood: string;
  venueName: string;
  venueAddress: string;
  dateDisplay: string;
  coverImage: string;
  hostName: string;
  hostRole: string;
  theme: string;
  secretAccessCode: string;
  seatNumber: number; // 1 to 6
  vibeMatch: number;
  curatorNote: string;
  status: "pending" | "accepted" | "declined";
  declineReason?: string;
  invitedAt: string;
  respondedAt?: string;
}

export interface TableMetrics {
  totalSeats: number;
  seatedCount: number;
  emptyCount: number;
  femaleCount: number;
  maleCount: number;
  otherCount: number;
  isParityOptimal: boolean; // 3 women, 3 men or close
  parityLabel: string;
  harmonyScore: number;
  dietarySummary: {
    veg: number;
    nonVeg: number;
    vegan: number;
    jain: number;
    allergies: string[];
  };
}

const STORAGE_EVENTS_KEY = "precious_meets_admin_events_v2";
const STORAGE_ATTENDEES_KEY = "precious_meets_admin_attendees_v2";
const STORAGE_USER_INVITATIONS_KEY = "precious_meets_user_invitations_v1";

export const INITIAL_USER_INVITATIONS: UserSeatInvitation[] = [];

export const INITIAL_ATTENDEES: AdminAttendee[] = [];

// Seed Events (Upcoming & Past) - Pure Real Data
export const INITIAL_EVENTS: AdminEvent[] = [];

export class EventsService {
  // 1. Get all events (real only, auto-purges legacy mock events)
  static getEvents(): AdminEvent[] {
    if (typeof window === "undefined") return INITIAL_EVENTS;
    try {
      const stored = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (stored) {
        const parsed: AdminEvent[] = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
          return INITIAL_EVENTS;
        }
        // Prune legacy mock event seeds
        const legacyMockIds = new Set([
          "evt_mehrauli_supper",
          "evt_delhi_vinyl",
          "evt_hauzkhas_afterdark",
          "evt_sunder_nursery_past",
        ]);
        const legacyMockCodes = new Set([
          "COURTYARD-902",
          "VINYL-411",
          "TWILIGHT-108",
          "SUNDER-PAST-04",
        ]);
        const cleaned = parsed
          .filter(
            (evt) =>
              evt &&
              typeof evt === "object" &&
              !legacyMockIds.has(evt.id) &&
              !legacyMockCodes.has(evt.secretAccessCode)
          )
          .map((evt) => ({
            ...evt,
            // Clean any mock attendee IDs (att_01..08) from seat slots
            seats: Array.isArray(evt.seats)
              ? evt.seats.map((seatId) =>
                  seatId && typeof seatId === "string" && seatId.startsWith("att_0") ? null : seatId
                )
              : [null, null, null, null, null, null],
          }));

        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    } catch (e) {
      console.error("[EventsService] Failed to load events from storage:", e);
      return INITIAL_EVENTS;
    }
  }

  // 2. Get event by ID
  static getEventById(id: string): AdminEvent | undefined {
    const events = this.getEvents();
    return events.find((e) => e.id === id);
  }

  private static generateUUID(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      try {
        return crypto.randomUUID();
      } catch {
        // fallback
      }
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // 3. Save / overwrite events list in local storage cache
  static saveEvents(events: AdminEvent[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.error("[EventsService] Failed to save events:", e);
    }
  }

  // 3b. Sync single event record to Supabase public.events table
  static async syncEventToDatabase(event: AdminEvent): Promise<boolean> {
    try {
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validId = UUID_REGEX.test(event.id) ? event.id : this.generateUUID();

      const payload: any = {
        id: validId,
        slug: event.slug || "meet-" + validId.slice(0, 8),
        title: event.title,
        city: event.city || "Delhi NCR",
        neighborhood: event.neighborhood || "Delhi",
        venue_name: event.venueName,
        venue_address: event.venueAddress,
        secret_access_code: event.secretAccessCode || "GATE-402",
        starts_at: event.startsAt,
        ends_at: event.endsAt,
        date_display: event.dateDisplay,
        price_inr: event.priceInr || 1999,
        category: event.category || "supper_club",
        host_name: event.hostName,
        host_role: event.hostRole,
        host_avatar: event.hostAvatar || null,
        cover_image: event.coverImage || null,
        theme: event.theme || null,
        menu_preview: event.menuPreview || [],
        dietary_options: event.dietaryOptions || [],
        status: event.status || "published",
        seats: event.seats || [null, null, null, null, null, null],
      };

      const { error } = await supabase.from("events").upsert(payload, { onConflict: "id" });
      if (error) {
        console.error("[EventsService] Supabase event upsert error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("[EventsService] Supabase event sync notice:", e);
      return false;
    }
  }

  // 3c. Delete event record from Supabase public.events table
  static async deleteEventFromDatabase(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) {
        console.error("[EventsService] Supabase event delete error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("[EventsService] Supabase event delete notice:", e);
      return false;
    }
  }

  // 3d. Fetch all live events directly from Supabase public.events table
  static async fetchEventsFromDb(): Promise<AdminEvent[]> {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("starts_at", { ascending: true });

      if (error) {
        console.warn("[EventsService] Supabase events fetch notice:", error.message);
        return this.getEvents();
      }

      if (data && Array.isArray(data)) {
        const mapped: AdminEvent[] = data.map((d: any) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          city: d.city || "Delhi NCR",
          neighborhood: d.neighborhood,
          venueName: d.venue_name,
          venueAddress: d.venue_address,
          secretAccessCode: d.secret_access_code,
          startsAt: d.starts_at,
          endsAt: d.ends_at,
          dateDisplay: d.date_display,
          priceInr: d.price_inr || 1999,
          category: d.category || "supper_club",
          hostName: d.host_name,
          hostRole: d.host_role,
          hostAvatar: d.host_avatar || undefined,
          coverImage: d.cover_image,
          theme: d.theme || "",
          menuPreview: Array.isArray(d.menu_preview) ? d.menu_preview : [],
          dietaryOptions: Array.isArray(d.dietary_options) ? d.dietary_options : [],
          status: d.status || "published",
          seats: Array.isArray(d.seats) ? d.seats : [null, null, null, null, null, null],
          emailsSentAt: d.emails_sent_at || null,
        }));

        const currentLocal = this.getEvents();
        const dbIds = new Set(mapped.map((m) => m.id));
        const unsyncedLocal = currentLocal.filter((l) => l.status === "draft" && !dbIds.has(l.id));
        const combined = [...mapped, ...unsyncedLocal];

        this.saveEvents(combined);
        return combined;
      }
    } catch (e) {
      console.warn("[EventsService] Supabase fetchEventsFromDb notice:", e);
    }
    return this.getEvents();
  }

  // 4. Create new event (Saves locally + syncs to Supabase public.events)
  static createEvent(eventData: Omit<AdminEvent, "id" | "seats">): AdminEvent {
    const events = this.getEvents();
    const newEvent: AdminEvent = {
      ...eventData,
      id: this.generateUUID(),
      seats: [null, null, null, null, null, null],
      emailsSentAt: null,
    };
    const updated = [newEvent, ...events];
    this.saveEvents(updated);
    this.syncEventToDatabase(newEvent).catch((e) =>
      console.warn("[EventsService] Failed to sync new event to Supabase:", e)
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("precious_meets_events_updated", { detail: { eventId: newEvent.id } }));
      window.dispatchEvent(new Event("storage"));
    }
    return newEvent;
  }

  // 5. Update existing event (Updates locally + syncs to Supabase public.events)
  static updateEvent(id: string, updates: Partial<AdminEvent>): AdminEvent {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Event not found");

    const updatedEvent = { ...events[index], ...updates };
    events[index] = updatedEvent;
    this.saveEvents(events);
    this.syncEventToDatabase(updatedEvent).catch((e) =>
      console.warn("[EventsService] Failed to sync updated event to Supabase:", e)
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("precious_meets_events_updated", { detail: { eventId: id } }));
      window.dispatchEvent(new Event("storage"));
    }
    return updatedEvent;
  }

  // 6. Delete event (Removes locally + deletes from Supabase public.events)
  static deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    this.saveEvents(filtered);
    this.deleteEventFromDatabase(id).catch((e) =>
      console.warn("[EventsService] Failed to delete event from Supabase:", e)
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("precious_meets_events_updated", { detail: { eventId: id } }));
      window.dispatchEvent(new Event("storage"));
    }
    return true;
  }

  // 7. Get all attendees pool (populated from real applications + manual attendees)
  static getAttendees(): AdminAttendee[] {
    if (typeof window === "undefined") return INITIAL_ATTENDEES;
    try {
      // Single Source of Truth: Real member applications from ApplicationsService
      // STRICT: Only approved verified members (exactly matching the "Verified Members" tab in Dossiers)
      const realApplications = ApplicationsService.getApplications();
      const mappedFromApps: AdminAttendee[] = realApplications
        .filter(
          (app) =>
            !isDeletedUser(app.applicantEmail, app.id) &&
            app.status === "approved"
        )
        .map((app) => ({
          id: app.id,
          name: app.applicantName,
          email: app.applicantEmail,
          phone: app.applicantPhone || "+91 98765 43210",
          avatar:
            app.avatarUrl ||
            app.userPhotoUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          city: (app.applicantCity as any) || "Delhi NCR",
          gender: "female",
          archetype: {
            title: app.archetypeTitle || "Curated Member",
            description: app.archetypeDescription || "Verified table guest",
            dimensions: {
              socialEnergy: app.socialEnergyScore || 70,
              conversationDepth: app.conversationDepthScore || 85,
              curiosity: app.curiosityScore || 80,
              adventure: app.adventureScore || 65,
            },
          },
          dietary: app.dietaryPreference || "Vegetarian",
          allergies: app.allergies || [],
          identityVerified: true,
          memberTier: "Private Circle Member",
          memberId: app.applicationReference,
        }));

      // Deduplicate by email / ID
      const seen = new Set<string>();
      const combined: AdminAttendee[] = [];
      for (const att of mappedFromApps) {
        if (isDeletedUser(att.email, att.id)) continue;
        const key = (att.email || att.id).toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(att);
        }
      }

      // Overwrite cache so stale mock/unverified attendees are purged immediately
      localStorage.setItem(STORAGE_ATTENDEES_KEY, JSON.stringify(combined));
      return combined;
    } catch (e) {
      console.error("[EventsService] Failed to load attendees:", e);
      return INITIAL_ATTENDEES;
    }
  }

  // 7b. Permanently delete attendee and unseat them from all events
  static deleteAttendee(idOrEmail: string, email?: string): AdminAttendee[] {
    const clean = idOrEmail.trim().toLowerCase();
    const rawId = clean.replace(/^ver_/, "");
    const cleanEmail = email?.trim().toLowerCase();

    recordDeletedUser(cleanEmail, clean);

    const stored = localStorage.getItem(STORAGE_ATTENDEES_KEY);
    let list: AdminAttendee[] = [];
    if (stored) {
      try {
        const parsed: AdminAttendee[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          list = parsed.filter((att) => {
            const attId = att.id.toLowerCase();
            const attEmail = att.email?.toLowerCase();
            if (attId === clean || attId === rawId) return false;
            if (cleanEmail && attEmail === cleanEmail) return false;
            if (attEmail === clean) return false;
            if (isDeletedUser(att.email, att.id)) return false;
            return true;
          });
        }
      } catch (e) {
        // ignore
      }
    }
    localStorage.setItem(STORAGE_ATTENDEES_KEY, JSON.stringify(list));

    // Sweep all events and free up seats occupied by this attendee
    try {
      const events = this.getEvents();
      let changed = false;
      const updatedEvents = events.map((evt) => {
        let seatChanged = false;
        const newSeats = (evt.seats || []).map((seatId) => {
          if (!seatId) return null;
          const s = seatId.toLowerCase();
          if (s === clean || s === rawId || (cleanEmail && s === cleanEmail)) {
            seatChanged = true;
            changed = true;
            return null;
          }
          return seatId;
        });

        const newAcceptances = { ...(evt.seatAcceptances || {}) };
        for (const k of Object.keys(newAcceptances)) {
          const lk = k.toLowerCase();
          if (lk === clean || lk === rawId || (cleanEmail && lk === cleanEmail)) {
            delete newAcceptances[k];
            seatChanged = true;
            changed = true;
          }
        }

        return seatChanged ? { ...evt, seats: newSeats, seatAcceptances: newAcceptances } : evt;
      });

      if (changed) {
        this.saveEvents(updatedEvents);
      }
    } catch (e) {
      console.warn("[EventsService] Failed to unseat deleted attendee from events:", e);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("precious_meets_attendees_updated"));
    }

    return this.getAttendees();
  }

  // 8. Assign attendee to a seat index (0..5)
  static assignSeat(eventId: string, seatIndex: number, attendeeId: string): AdminEvent {
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const attendees = this.getAttendees();
    const attendee = attendees.find((a) => a.id === attendeeId);

    // Clone seats
    const newSeats = [...event.seats];

    // Check if attendee is already seated in another seat in the same event
    const existingIndex = newSeats.findIndex((id) => id === attendeeId);
    if (existingIndex !== -1 && existingIndex !== seatIndex) {
      newSeats[existingIndex] = null;
    }

    newSeats[seatIndex] = attendeeId;

    const seatAcceptances: Record<string, SeatAcceptance> = { ...(event.seatAcceptances || {}) };
    const prevAcceptance = seatAcceptances[attendeeId];
    if (!prevAcceptance || prevAcceptance.status !== "accepted") {
      seatAcceptances[attendeeId] = {
        attendeeId,
        attendeeEmail: attendee?.email,
        attendeeName: attendee?.name,
        seatNumber: seatIndex + 1,
        status: prevAcceptance?.status || "pending",
        invitedAt: prevAcceptance?.invitedAt || new Date().toISOString(),
        emailSent: Boolean(prevAcceptance?.emailSent),
        emailSentAt: prevAcceptance?.emailSentAt,
      };
    }

    // Also auto-prepare the UserSeatInvitation so user sees it in their dashboard
    if (attendee) {
      const invitations = this.getUserInvitations();
      const existingIdx = invitations.findIndex(
        (i) => i.eventId === event.id && (i.attendeeId === attendee.id || i.attendeeEmail?.toLowerCase() === attendee.email.toLowerCase())
      );

      const invData: UserSeatInvitation = {
        id: existingIdx !== -1 ? invitations[existingIdx].id : "inv_" + event.id + "_" + attendee.id,
        eventId: event.id,
        eventTitle: event.title,
        attendeeId: attendee.id,
        attendeeEmail: attendee.email,
        city: event.city,
        neighborhood: event.neighborhood,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        dateDisplay: event.dateDisplay,
        coverImage: event.coverImage,
        hostName: event.hostName,
        hostRole: event.hostRole,
        theme: event.theme,
        secretAccessCode: event.secretAccessCode,
        seatNumber: seatIndex + 1,
        vibeMatch: 95,
        curatorNote: `Hand-selected by our table curators based on conversational chemistry with ${event.hostName}.`,
        status: seatAcceptances[attendeeId].status,
        invitedAt: new Date().toISOString(),
      };

      if (existingIdx !== -1) {
        invitations[existingIdx] = { ...invitations[existingIdx], ...invData };
      } else {
        invitations.unshift(invData);
      }
      this.saveUserInvitations(invitations);
      this.syncInvitationToDatabase(attendee.email, invData).catch((e) =>
        console.warn("[EventsService] Supabase invitation assign sync notice:", e)
      );
    }

    const updated = this.updateEvent(eventId, { seats: newSeats, seatAcceptances });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("precious_meets_events_updated", { detail: { eventId } }));
      window.dispatchEvent(new Event("storage"));
    }
    return updated;
  }

  // 9. Unseat an attendee from a seat index (0..5)
  static unassignSeat(eventId: string, seatIndex: number): AdminEvent {
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const previousAttendeeId = event.seats[seatIndex];
    const newSeats = [...event.seats];
    newSeats[seatIndex] = null;

    const seatAcceptances = { ...(event.seatAcceptances || {}) };
    if (previousAttendeeId) {
      delete seatAcceptances[previousAttendeeId];
      // remove invitation from user invitations
      const invitations = this.getUserInvitations().filter(
        (inv) => !(inv.eventId === eventId && (inv.attendeeId === previousAttendeeId || inv.seatNumber === seatIndex + 1))
      );
      this.saveUserInvitations(invitations);
      this.removeInvitationFromDatabase(previousAttendeeId, eventId).catch((e) =>
        console.warn("[EventsService] Supabase invitation remove notice:", e)
      );
    }

    const updated = this.updateEvent(eventId, { seats: newSeats, seatAcceptances });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("precious_meets_events_updated", { detail: { eventId } }));
      window.dispatchEvent(new Event("storage"));
    }
    return updated;
  }

  // 10. Swap seats between two positions
  static swapSeats(eventId: string, indexA: number, indexB: number): AdminEvent {
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const newSeats = [...event.seats];
    const temp = newSeats[indexA];
    newSeats[indexA] = newSeats[indexB];
    newSeats[indexB] = temp;
    return this.updateEvent(eventId, { seats: newSeats });
  }

  // 11. Calculate Table Metrics for an Event
  static calculateTableMetrics(event: AdminEvent, attendees: AdminAttendee[]): TableMetrics {
    const seatedAttendees = event.seats
      .map((id) => (id ? attendees.find((a) => a.id === id) : null))
      .filter((a): a is AdminAttendee => a !== null && a !== undefined);

    const seatedCount = seatedAttendees.length;
    const emptyCount = 6 - seatedCount;

    let femaleCount = 0;
    let maleCount = 0;
    let otherCount = 0;

    const dietaryCounts = {
      veg: 0,
      nonVeg: 0,
      vegan: 0,
      jain: 0,
      allergies: [] as string[],
    };

    seatedAttendees.forEach((a) => {
      if (a.gender === "female") femaleCount++;
      else if (a.gender === "male") maleCount++;
      else otherCount++;

      if (a.dietary === "Vegetarian") dietaryCounts.veg++;
      else if (a.dietary === "Non-Vegetarian") dietaryCounts.nonVeg++;
      else if (a.dietary === "Vegan") dietaryCounts.vegan++;
      else if (a.dietary === "Jain") dietaryCounts.jain++;

      (a.allergies || []).forEach((alg) => {
        if (!dietaryCounts.allergies.includes(alg)) {
          dietaryCounts.allergies.push(alg);
        }
      });
    });

    // Parity evaluation
    const isParityOptimal =
      (femaleCount === 3 && maleCount === 3) ||
      (seatedCount === 4 && femaleCount === 2 && maleCount === 2) ||
      (seatedCount === 2 && femaleCount === 1 && maleCount === 1);

    let parityLabel = "Incomplete Table";
    if (seatedCount === 6) {
      if (femaleCount === 3 && maleCount === 3) {
        parityLabel = "Optimal 50:50 Parity";
      } else if (femaleCount > maleCount) {
        parityLabel = `Women Majority (${femaleCount}F / ${maleCount}M)`;
      } else {
        parityLabel = `Parity Attention (${femaleCount}F / ${maleCount}M)`;
      }
    } else if (seatedCount > 0) {
      parityLabel = `${femaleCount} Women · ${maleCount} Men`;
    }

    // Harmony calculation: baseline 88% + archetype variance bonus
    let harmonyScore = 88;
    if (seatedCount >= 2) {
      const avgEnergy =
        seatedAttendees.reduce((acc, a) => acc + (a.archetype?.dimensions?.socialEnergy ?? 70), 0) /
        seatedCount;
      const avgDepth =
        seatedAttendees.reduce((acc, a) => acc + (a.archetype?.dimensions?.conversationDepth ?? 80), 0) /
        seatedCount;

      // Reward high conversation depth and moderate social energy balance
      if (avgDepth > 75) harmonyScore += 4;
      if (avgEnergy >= 50 && avgEnergy <= 75) harmonyScore += 3;
      if (isParityOptimal) harmonyScore += 3;
    }
    harmonyScore = Math.min(99, Math.max(70, harmonyScore));

    return {
      totalSeats: 6,
      seatedCount,
      emptyCount,
      femaleCount,
      maleCount,
      otherCount,
      isParityOptimal,
      parityLabel,
      harmonyScore,
      dietarySummary: dietaryCounts,
    };
  }

  // 12. Send official invitations / table passes to all seated attendees
  static async sendEventInvitations(
    eventId: string
  ): Promise<{ success: boolean; dispatchedCount: number; alreadySentCount: number; totalSeated: number }> {
    const event = this.getEventById(eventId);
    if (!event) throw new Error("Event not found");

    const attendees = this.getAttendees();
    const seatedAttendees = event.seats
      .map((id, index) => (id ? { attendee: attendees.find((a) => a.id === id), seatIndex: index } : null))
      .filter((x): x is { attendee: AdminAttendee; seatIndex: number } => Boolean(x && x.attendee));

    if (seatedAttendees.length === 0) {
      throw new Error("No attendees are seated on this table to email.");
    }

    // Load existing invitations to update or prepend
    const existingInvitations = this.getUserInvitations();
    const updatedInvitations = [...existingInvitations];
    const seatAcceptances: Record<string, SeatAcceptance> = { ...(event.seatAcceptances || {}) };

    const dashboardUrl = typeof window !== "undefined"
      ? `${window.location.origin}/dashboard?tab=requests`
      : "http://localhost:8080/dashboard?tab=requests";

    let sentCount = 0;
    let alreadySentCount = 0;

    for (const { attendee, seatIndex } of seatedAttendees) {
      const seatNumber = seatIndex + 1;
      const existing = seatAcceptances[attendee.id];
      const hasEmailBeenSent = Boolean(existing?.emailSent);

      // If attendee has ALREADY received an invitation email, DO NOT send again!
      // They are already marked as email sent and waiting for acceptance (or accepted).
      if (hasEmailBeenSent) {
        alreadySentCount++;
        continue;
      }

      // Attendee has not received an invitation email yet (newly seated or replacement member)
      try {
        await EmailService.sendEmail({
          to: attendee.email,
          template: "booking_confirmed",
          data: {
            name: attendee.name,
            experienceTitle: event.title,
            date: event.dateDisplay,
            venue: `${event.venueName} (${event.venueAddress}) — Gate PIN: ${event.secretAccessCode}`,
            host: event.hostName,
            reference: `MEET-${event.secretAccessCode}-${attendee.id.slice(-4).toUpperCase()}`,
            dashboardUrl,
          },
        });
        sentCount++;
      } catch (err) {
        console.warn(`[EventsService] Could not send to ${attendee.email}:`, err);
      }

      // Mark as email sent and waiting for acceptance (status: "pending")
      const resolvedStatus = existing?.status === "accepted" ? "accepted" : "pending";

      seatAcceptances[attendee.id] = {
        attendeeId: attendee.id,
        attendeeEmail: attendee.email,
        attendeeName: attendee.name,
        seatNumber,
        status: resolvedStatus,
        invitedAt: existing?.invitedAt || new Date().toISOString(),
        emailSent: true,
        emailSentAt: new Date().toISOString(),
      };

      // Create or update invitation for user dashboard
      const invIndex = updatedInvitations.findIndex(
        (i) => i.eventId === event.id && (i.attendeeId === attendee.id || i.attendeeEmail?.toLowerCase() === attendee.email.toLowerCase())
      );

      const invData: UserSeatInvitation = {
        id: invIndex !== -1 ? updatedInvitations[invIndex].id : "inv_" + event.id + "_" + attendee.id,
        eventId: event.id,
        eventTitle: event.title,
        attendeeId: attendee.id,
        attendeeEmail: attendee.email,
        city: event.city,
        neighborhood: event.neighborhood,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        dateDisplay: event.dateDisplay,
        coverImage: event.coverImage,
        hostName: event.hostName,
        hostRole: event.hostRole,
        theme: event.theme,
        secretAccessCode: event.secretAccessCode,
        seatNumber,
        vibeMatch: 95,
        curatorNote: `Hand-selected by our table curators based on conversational chemistry with ${event.hostName}.`,
        status: resolvedStatus,
        invitedAt: new Date().toISOString(),
      };

      if (invIndex !== -1) {
        updatedInvitations[invIndex] = { ...updatedInvitations[invIndex], ...invData };
      } else {
        updatedInvitations.unshift(invData);
      }

      // Sync live to Supabase member_applications so member immediately sees invitation on any device
      this.syncInvitationToDatabase(attendee.email, invData).catch((e) =>
        console.warn("[EventsService] Supabase invitation dispatch sync notice:", e)
      );
    }

    this.saveUserInvitations(updatedInvitations);

    // Mark timestamp and acceptances in event record
    this.updateEvent(eventId, {
      emailsSentAt: new Date().toISOString(),
      seatAcceptances,
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("precious_meets_events_updated", { detail: { eventId } }));
      window.dispatchEvent(new Event("storage"));
    }

    return {
      success: true,
      dispatchedCount: sentCount,
      alreadySentCount,
      totalSeated: seatedAttendees.length,
    };
  }

  // 13. Get all user seat invitations (with optional email filter)
  static getUserInvitations(userEmail?: string): UserSeatInvitation[] {
    if (typeof window === "undefined") return INITIAL_USER_INVITATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_USER_INVITATIONS_KEY);
      if (stored) {
        const parsed: UserSeatInvitation[] = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
          return INITIAL_USER_INVITATIONS;
        }
        // Purge legacy mock invitations
        const cleaned = parsed.filter(
          (inv) =>
            inv &&
            typeof inv === "object" &&
            typeof inv.id === "string" &&
            !inv.id.startsWith("inv_supper_") &&
            !inv.id.startsWith("inv_vinyl_") &&
            inv.eventId !== "evt_mehrauli_supper" &&
            inv.eventId !== "evt_delhi_vinyl"
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_USER_INVITATIONS_KEY, JSON.stringify(cleaned));
        }

        // If userEmail is provided, return only matched invitations for this user
        if (userEmail && userEmail.trim()) {
          const lower = userEmail.trim().toLowerCase();
          return cleaned.filter(
            (inv) => inv && inv.attendeeEmail && inv.attendeeEmail.toLowerCase() === lower
          );
        }

        return cleaned;
      }
      localStorage.setItem(STORAGE_USER_INVITATIONS_KEY, JSON.stringify(INITIAL_USER_INVITATIONS));
      return INITIAL_USER_INVITATIONS;
    } catch (e) {
      console.error("[EventsService] Failed to load user invitations:", e);
      return INITIAL_USER_INVITATIONS;
    }
  }

  /**
   * Fetches the member's invitations live from Supabase member_applications table.
   * Merges with localStorage so invitations are available on all devices/browsers.
   */
  static async fetchUserInvitations(userEmail?: string): Promise<UserSeatInvitation[]> {
    if (!userEmail || !userEmail.trim()) {
      return this.getUserInvitations();
    }
    const cleanEmail = userEmail.trim().toLowerCase();

    try {
      const { data, error } = await supabase
        .from("member_applications")
        .select("id, scores")
        .ilike("applicant_email", cleanEmail)
        .maybeSingle();

      if (!error && data && data.scores && Array.isArray(data.scores.invitations)) {
        const dbInvitations: UserSeatInvitation[] = data.scores.invitations;
        const currentLocal = this.getUserInvitations();
        const merged = [...currentLocal];

        for (const dbInv of dbInvitations) {
          const idx = merged.findIndex(
            (l) => l.id === dbInv.id || (l.eventId === dbInv.eventId && l.attendeeEmail?.toLowerCase() === cleanEmail)
          );
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...dbInv };
          } else {
            merged.unshift(dbInv);
          }
        }

        this.saveUserInvitations(merged);
        return this.getUserInvitations(cleanEmail);
      }
    } catch (e) {
      console.warn("[EventsService] Failed to load invitations from Supabase:", e);
    }

    return this.getUserInvitations(cleanEmail);
  }

  /**
   * Syncs a seat invitation into the member's application record in Supabase.
   */
  static async syncInvitationToDatabase(userEmail: string, invitation: UserSeatInvitation): Promise<void> {
    if (!userEmail || !userEmail.trim()) return;
    const cleanEmail = userEmail.trim().toLowerCase();

    try {
      const { data, error } = await supabase
        .from("member_applications")
        .select("id, scores")
        .or(`applicant_email.ilike.${cleanEmail},id.eq.${invitation.attendeeId}`)
        .maybeSingle();

      if (error || !data) {
        console.warn("[EventsService] Member record not found in Supabase for email:", cleanEmail);
        return;
      }

      const existingScores = data.scores || {};
      const existingInvList: UserSeatInvitation[] = Array.isArray(existingScores.invitations)
        ? existingScores.invitations
        : [];

      const idx = existingInvList.findIndex(
        (i) => i.id === invitation.id || (i.eventId === invitation.eventId && i.attendeeEmail?.toLowerCase() === cleanEmail)
      );

      if (idx !== -1) {
        existingInvList[idx] = { ...existingInvList[idx], ...invitation };
      } else {
        existingInvList.unshift(invitation);
      }

      await supabase
        .from("member_applications")
        .update({
          scores: {
            ...existingScores,
            invitations: existingInvList,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
    } catch (e) {
      console.warn("[EventsService] Failed to sync invitation to Supabase:", e);
    }
  }

  /**
   * Removes an invitation from Supabase when a member is unseated.
   */
  static async removeInvitationFromDatabase(attendeeIdOrEmail: string, eventId: string): Promise<void> {
    if (!attendeeIdOrEmail) return;
    const clean = attendeeIdOrEmail.trim().toLowerCase();

    try {
      const { data } = await supabase
        .from("member_applications")
        .select("id, scores")
        .or(`applicant_email.ilike.${clean},id.eq.${attendeeIdOrEmail}`)
        .maybeSingle();

      if (!data) return;

      const existingScores = data.scores || {};
      if (!Array.isArray(existingScores.invitations)) return;

      const filtered = existingScores.invitations.filter(
        (i: UserSeatInvitation) => i.eventId !== eventId
      );

      await supabase
        .from("member_applications")
        .update({
          scores: {
            ...existingScores,
            invitations: filtered,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
    } catch (e) {
      console.warn("[EventsService] Failed to remove invitation from Supabase:", e);
    }
  }

  // 14. Save user invitations
  static saveUserInvitations(invitations: UserSeatInvitation[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_USER_INVITATIONS_KEY, JSON.stringify(invitations));
    } catch (e) {
      console.error("[EventsService] Failed to save user invitations:", e);
    }
  }

  // 15. Respond to a seat invitation (Accept or Decline)
  static respondToInvitation(
    invitationId: string,
    status: "accepted" | "declined",
    declineReason?: string
  ): UserSeatInvitation {
    const invitations = this.getUserInvitations();
    const index = invitations.findIndex((i) => i.id === invitationId);
    if (index === -1) throw new Error("Invitation not found");

    const updatedInvitation: UserSeatInvitation = {
      ...invitations[index],
      status,
      declineReason: declineReason || undefined,
      respondedAt: new Date().toISOString(),
    };

    invitations[index] = updatedInvitation;
    this.saveUserInvitations(invitations);

    // Sync acceptance into AdminEvent so Admin panel immediately reflects user acceptance
    const event = this.getEventById(updatedInvitation.eventId);
    if (event) {
      const seatAcceptances = { ...(event.seatAcceptances || {}) };

      // Identify attendee
      let attendeeId = updatedInvitation.attendeeId;
      if (!attendeeId && event.seats[updatedInvitation.seatNumber - 1]) {
        attendeeId = event.seats[updatedInvitation.seatNumber - 1]!;
      }
      if (!attendeeId) {
        const attendees = this.getAttendees();
        const matched = attendees.find(
          (a) => a.email.toLowerCase() === (updatedInvitation.attendeeEmail || "").toLowerCase()
        );
        if (matched) attendeeId = matched.id;
      }

      if (attendeeId) {
        seatAcceptances[attendeeId] = {
          attendeeId,
          attendeeEmail: updatedInvitation.attendeeEmail,
          seatNumber: updatedInvitation.seatNumber,
          status: status,
          invitedAt: updatedInvitation.invitedAt,
          respondedAt: new Date().toISOString(),
          declineReason,
          emailSent: seatAcceptances[attendeeId]?.emailSent ?? true,
          emailSentAt: seatAcceptances[attendeeId]?.emailSentAt,
        };

        this.updateEvent(event.id, { seatAcceptances });

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("precious_meets_events_updated", { detail: { eventId: event.id } })
          );
          window.dispatchEvent(new Event("storage"));
        }
      }
    }

    // Sync acceptance or decline to Supabase member_applications
    this.syncInvitationToDatabase(updatedInvitation.attendeeEmail, updatedInvitation).catch((e) =>
      console.warn("[EventsService] Failed to sync invitation response to Supabase:", e)
    );

    // If accepted, ensure the event reservation is recorded in member's active RSVPs
    if (typeof window !== "undefined") {
      try {
        const LOCAL_STORAGE_RESERVATIONS_KEY = "precious_meets_member_rsvps";
        const saved = localStorage.getItem(LOCAL_STORAGE_RESERVATIONS_KEY);
        const rsvps: string[] = saved ? JSON.parse(saved) : [];
        if (status === "accepted") {
          if (!rsvps.includes(updatedInvitation.eventId)) {
            rsvps.push(updatedInvitation.eventId);
            localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(rsvps));
          }
        } else if (status === "declined") {
          const filtered = rsvps.filter((id) => id !== updatedInvitation.eventId);
          localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(filtered));
        }
      } catch (err) {
        console.warn("[EventsService] Could not sync RSVP list:", err);
      }
    }

    return updatedInvitation;
  }

  // 15b. Admin Manual Override for Seat Acceptance (Accepted & Booked / Pending / Declined)
  static adminSetSeatAcceptance(
    eventId: string,
    attendeeId: string,
    status: "pending" | "accepted" | "declined"
  ): AdminEvent {
    const event = this.getEventById(eventId);
    if (!event) throw new Error("Event not found");

    const attendees = this.getAttendees();
    const attendee = attendees.find((a) => a.id === attendeeId);

    const seatIdx = event.seats.findIndex((id) => id === attendeeId);
    const seatNumber = seatIdx !== -1 ? seatIdx + 1 : 1;

    const seatAcceptances = { ...(event.seatAcceptances || {}) };
    const existing = seatAcceptances[attendeeId];
    seatAcceptances[attendeeId] = {
      attendeeId,
      attendeeEmail: attendee?.email,
      attendeeName: attendee?.name,
      seatNumber,
      status,
      invitedAt: existing?.invitedAt || new Date().toISOString(),
      respondedAt: status !== "pending" ? new Date().toISOString() : undefined,
      emailSent: existing?.emailSent ?? true,
      emailSentAt: existing?.emailSentAt,
    };

    // Also sync UserSeatInvitation
    const invitations = this.getUserInvitations();
    const invIndex = invitations.findIndex(
      (i) => i.eventId === eventId && (i.attendeeId === attendeeId || i.seatNumber === seatNumber)
    );
    if (invIndex !== -1) {
      invitations[invIndex].status = status;
      invitations[invIndex].respondedAt = status !== "pending" ? new Date().toISOString() : undefined;
      this.saveUserInvitations(invitations);
    }

    const updated = this.updateEvent(eventId, { seatAcceptances });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("precious_meets_events_updated", { detail: { eventId } })
      );
      window.dispatchEvent(new Event("storage"));
    }
    return updated;
  }

  // 16. Create a new invitation for a user (called by Admin or Curator)
  static createInvitationForUser(
    invitationData: Omit<UserSeatInvitation, "id" | "invitedAt">
  ): UserSeatInvitation {
    const invitations = this.getUserInvitations();
    const newInvitation: UserSeatInvitation = {
      ...invitationData,
      id: "inv_" + Math.random().toString(36).substring(2, 9),
      invitedAt: new Date().toISOString(),
    };
    const updated = [newInvitation, ...invitations];
    this.saveUserInvitations(updated);
    return newInvitation;
  }

  // 17. Check In an Attendee for an Event
  static checkInAttendee(
    eventId: string,
    attendeeId: string,
    seatNumber?: number
  ): AdminEvent {
    const event = this.getEventById(eventId);
    if (!event) throw new Error("Event not found");

    const attendees = this.getAttendees();
    const attendee = attendees.find((a) => a.id === attendeeId);
    if (!attendee) throw new Error("Attendee not found in roster");

    // Determine seat number if not provided
    const seatIdx = event.seats.findIndex((id) => id === attendeeId);
    const resolvedSeatNumber = seatNumber ?? (seatIdx !== -1 ? seatIdx + 1 : 1);

    const existingCheckIns = event.checkIns || {};
    const newCheckIn: EventCheckIn = {
      attendeeId,
      attendeeName: attendee.name,
      memberId: attendee.memberId,
      seatNumber: resolvedSeatNumber,
      checkedInAt: new Date().toISOString(),
    };

    const updated = this.updateEvent(eventId, {
      checkIns: {
        ...existingCheckIns,
        [attendeeId]: newCheckIn,
      },
    });

    return updated;
  }

  // 18. Undo/Reset Check In for an Attendee
  static undoCheckIn(eventId: string, attendeeId: string): AdminEvent {
    const event = this.getEventById(eventId);
    if (!event) throw new Error("Event not found");

    const existingCheckIns = { ...(event.checkIns || {}) };
    delete existingCheckIns[attendeeId];

    return this.updateEvent(eventId, {
      checkIns: existingCheckIns,
    });
  }

  // 19. Parse raw QR data payload
  static parseQrPayload(raw: string): {
    memberId?: string | undefined;
    attendeeId?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    raw: string;
  } {
    const trimmed = raw.trim();
    let memberId: string | undefined;
    let attendeeId: string | undefined;
    let name: string | undefined;
    let email: string | undefined;

    // Check if it's a URL
    try {
      if (trimmed.includes("://") || trimmed.startsWith("/")) {
        const url = new URL(trimmed, "https://preciousmeets.com");
        memberId = url.searchParams.get("memberId") || undefined;
        name = url.searchParams.get("user") || undefined;
        email = url.searchParams.get("email") || undefined;
        attendeeId = url.searchParams.get("attendeeId") || undefined;
      }
    } catch {
      // Not a valid URL
    }

    // Check if it's JSON
    if (!memberId && trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        memberId = parsed.memberId || parsed.member_id;
        attendeeId = parsed.attendeeId || parsed.attendee_id;
        name = parsed.name || parsed.displayName;
        email = parsed.email;
      } catch {
        // Not valid JSON
      }
    }

    // If still not extracted, check standard Precious Meets patterns
    if (!memberId) {
      // Look for PM-xxxx, PM-MEMBER-xxxx
      const pmMatch = trimmed.match(/PM-(?:[A-Z]+-)?\d+/i);
      if (pmMatch) {
        memberId = pmMatch[0].toUpperCase();
      }
    }

    if (!attendeeId) {
      // Look for att_xx
      const attMatch = trimmed.match(/att_\w+/i);
      if (attMatch) {
        attendeeId = attMatch[0];
      }
    }

    return { memberId, attendeeId, name, email, raw: trimmed };
  }

  // 20. Verify Scanned QR Payload against specific event's 6-seat table
  static verifyScanPayload(
    eventId: string,
    qrPayload: string
  ): {
    success: boolean;
    reason: "admitted" | "already_checked_in" | "not_in_table" | "unrecognized";
    message: string;
    attendee?: AdminAttendee | undefined;
    seatNumber?: number | undefined;
    alreadyCheckedIn?: boolean | undefined;
    checkedInAt?: string | undefined;
    assignedOtherEvent?: AdminEvent | undefined;
  } {
    const event = this.getEventById(eventId);
    if (!event) {
      return {
        success: false,
        reason: "unrecognized",
        message: "Event not found in system.",
      };
    }

    const attendees = this.getAttendees();
    const parsed = this.parseQrPayload(qrPayload);

    // Find matching attendee in the master roster
    let matchedAttendee: AdminAttendee | undefined;

    if (parsed.memberId) {
      matchedAttendee = attendees.find(
        (a) => a.memberId.toUpperCase() === parsed.memberId!.toUpperCase()
      );
    }

    if (!matchedAttendee && parsed.attendeeId) {
      matchedAttendee = attendees.find((a) => a.id === parsed.attendeeId);
    }

    if (!matchedAttendee && parsed.email) {
      matchedAttendee = attendees.find(
        (a) => a.email.toLowerCase() === parsed.email!.toLowerCase()
      );
    }

    if (!matchedAttendee && parsed.name) {
      matchedAttendee = attendees.find(
        (a) => a.name.toLowerCase() === parsed.name!.toLowerCase()
      );
    }

    // Direct string match against attendees list
    if (!matchedAttendee) {
      const lowerRaw = parsed.raw.toLowerCase();
      matchedAttendee = attendees.find(
        (a) =>
          lowerRaw.includes(a.memberId.toLowerCase()) ||
          lowerRaw.includes(a.id.toLowerCase()) ||
          lowerRaw.includes(a.email.toLowerCase()) ||
          lowerRaw.includes(a.name.toLowerCase())
      );
    }

    // 1. If not a recognized Precious Meets member pass
    if (!matchedAttendee) {
      return {
        success: false,
        reason: "unrecognized",
        message: "Unrecognized QR Pass. No matching registered Precious Meets member found in the database.",
      };
    }

    // 2. CHECK IF THIS ATTENDEE IS IN THE 6-SEATER TABLE OF THIS EVENT
    const seatIndex = event.seats.findIndex((id) => id === matchedAttendee!.id);

    // CRITICAL: If they aren't in the table, the QR won't scan / entry refused!
    if (seatIndex === -1) {
      // Find if they are seated in any other event
      const allEvents = this.getEvents();
      const otherEvent = allEvents.find(
        (e) => e.id !== eventId && e.seats.includes(matchedAttendee!.id)
      );

      return {
        success: false,
        reason: "not_in_table",
        message: `Entry Refused: ${matchedAttendee.name} (${matchedAttendee.memberId}) is NOT assigned to this table.`,
        attendee: matchedAttendee,
        assignedOtherEvent: otherEvent,
      };
    }

    // 3. Attendee IS in the table!
    const seatNumber = seatIndex + 1;
    const existingCheckIn = event.checkIns?.[matchedAttendee.id];

    if (existingCheckIn) {
      return {
        success: true,
        reason: "already_checked_in",
        alreadyCheckedIn: true,
        message: `${matchedAttendee.name} was already checked in for Seat #${seatNumber} at ${new Date(
          existingCheckIn.checkedInAt
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Entry re-verified.`,
        attendee: matchedAttendee,
        seatNumber,
        checkedInAt: existingCheckIn.checkedInAt,
      };
    }

    // 4. Record new check-in!
    this.checkInAttendee(eventId, matchedAttendee.id, seatNumber);

    return {
      success: true,
      reason: "admitted",
      alreadyCheckedIn: false,
      message: `Entry Granted! Welcome ${matchedAttendee.name}. Guided to Seat #${seatNumber}.`,
      attendee: matchedAttendee,
      seatNumber,
      checkedInAt: new Date().toISOString(),
    };
  }
}
