import { EmailService } from "@/lib/email-service";

export interface AdminAttendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: "Delhi NCR" | "Bengaluru";
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
  dietary: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Jain";
  allergies: string[];
  identityVerified: boolean;
  memberTier: "Founding Member" | "Annual Pass" | "Invited Guest";
  memberId: string;
}

export interface AdminEvent {
  id: string;
  slug: string;
  title: string;
  city: "Delhi NCR" | "Bengaluru";
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

// Seed Attendees Pool (Rich, verified profiles with varied archetypes)
export const INITIAL_ATTENDEES: AdminAttendee[] = [
  {
    id: "att_01",
    name: "Tara Sen",
    email: "tara.sen@example.com",
    phone: "+91 98112 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "female",
    archetype: {
      title: "The Quiet Observer",
      description: "Draws energy from intimate nuance, deep listening, and slow revelations.",
      dimensions: { socialEnergy: 48, conversationDepth: 88, curiosity: 82, adventure: 64 },
    },
    dietary: "Vegetarian",
    allergies: ["Gluten sensitivity"],
    identityVerified: true,
    memberTier: "Founding Member",
    memberId: "PM-FOUNDER-8841",
  },
  {
    id: "att_02",
    name: "Kabir Mathur",
    email: "kabir.m@example.com",
    phone: "+91 98201 98765",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "male",
    archetype: {
      title: "The Curious Flâneur",
      description: "Thrives at the intersection of architectural wonder, cultural history, and dinner dialogue.",
      dimensions: { socialEnergy: 74, conversationDepth: 80, curiosity: 92, adventure: 78 },
    },
    dietary: "Non-Vegetarian",
    allergies: [],
    identityVerified: true,
    memberTier: "Founding Member",
    memberId: "PM-FOUNDER-1209",
  },
  {
    id: "att_03",
    name: "Aria Sharma",
    email: "aria.sharma@example.com",
    phone: "+91 99100 88214",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "female",
    archetype: {
      title: "The Passionate Debater",
      description: "Brings vigorous intellect and deep warmth into unhurried discussions.",
      dimensions: { socialEnergy: 82, conversationDepth: 86, curiosity: 79, adventure: 70 },
    },
    dietary: "Vegetarian",
    allergies: ["Peanuts"],
    identityVerified: true,
    memberTier: "Annual Pass",
    memberId: "PM-ANNUAL-3910",
  },
  {
    id: "att_04",
    name: "Rohan Patel",
    email: "rohan.patel@example.com",
    phone: "+91 98450 12345",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "male",
    archetype: {
      title: "The Serene Minimalist",
      description: "Appreciates unhurried pacing, understated elegance, and poetic candor.",
      dimensions: { socialEnergy: 52, conversationDepth: 75, curiosity: 80, adventure: 60 },
    },
    dietary: "Jain",
    allergies: [],
    identityVerified: true,
    memberTier: "Founding Member",
    memberId: "PM-FOUNDER-4491",
  },
  {
    id: "att_05",
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "+91 98210 77651",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "female",
    archetype: {
      title: "The Architectural Mind",
      description: "Fascinated by urban design, intentional spaces, and structural beauty.",
      dimensions: { socialEnergy: 65, conversationDepth: 84, curiosity: 94, adventure: 72 },
    },
    dietary: "Vegan",
    allergies: ["Dairy"],
    identityVerified: true,
    memberTier: "Founding Member",
    memberId: "PM-FOUNDER-7012",
  },
  {
    id: "att_06",
    name: "Devrath Rao",
    email: "devrath.rao@example.com",
    phone: "+91 99880 33412",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "male",
    archetype: {
      title: "The Eclectic Storyteller",
      description: "Weaves travel folklore, ancient recipes, and rare music into memorable meals.",
      dimensions: { socialEnergy: 78, conversationDepth: 78, curiosity: 88, adventure: 85 },
    },
    dietary: "Non-Vegetarian",
    allergies: [],
    identityVerified: true,
    memberTier: "Annual Pass",
    memberId: "PM-ANNUAL-5521",
  },
  {
    id: "att_07",
    name: "Meera Kapoor",
    email: "meera.k@example.com",
    phone: "+91 98114 66209",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "female",
    archetype: {
      title: "The Curious Flâneur",
      description: "Loves solitary walks that culminate in lively tables with open hearts.",
      dimensions: { socialEnergy: 68, conversationDepth: 82, curiosity: 90, adventure: 76 },
    },
    dietary: "Vegetarian",
    allergies: [],
    identityVerified: true,
    memberTier: "Founding Member",
    memberId: "PM-FOUNDER-9014",
  },
  {
    id: "att_08",
    name: "Aditya Roy",
    email: "aditya.roy@example.com",
    phone: "+91 98200 44321",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
    city: "Delhi NCR",
    gender: "male",
    archetype: {
      title: "The Quiet Observer",
      description: "Thrives in slow conversation over natural wine and candlelight.",
      dimensions: { socialEnergy: 45, conversationDepth: 90, curiosity: 78, adventure: 62 },
    },
    dietary: "Vegetarian",
    allergies: [],
    identityVerified: true,
    memberTier: "Annual Pass",
    memberId: "PM-ANNUAL-8110",
  },
];

// Seed Events (Upcoming & Past)
export const INITIAL_EVENTS: AdminEvent[] = [
  {
    id: "evt_mehrauli_supper",
    slug: "the-long-table-supper-delhi",
    title: "The Long Table Supper",
    city: "Delhi NCR",
    neighborhood: "Mehrauli",
    venueName: "The Banyan Courtyard at Mehrauli",
    venueAddress: "Kalka Das Marg, Near Qutub Complex, Mehrauli, New Delhi 110030",
    secretAccessCode: "COURTYARD-902",
    startsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000 + 3.5 * 3600 * 1000).toISOString(),
    dateDisplay: "This Thursday · 8:00 PM",
    priceInr: 2499,
    category: "supper_club",
    hostName: "Chef Tara Sen & Sommelier Kabir",
    hostRole: "Culinary Anthropologist & Supper Host",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    theme: "Four seasonal courses, candlelight & natural wine",
    menuPreview: [
      "Amuse: Smoked jackfruit tartlets with kokum glaze",
      "Course 1: Spiced burrata or charred heirloom pumpkin",
      "Main: Slow-cooked black cardamom lamb shank or wild mushroom saffron pulao",
      "Dessert: Fig leaf panna cotta with roasted pistachio crisp",
    ],
    dietaryOptions: ["Vegetarian", "Non-Vegetarian", "Jain Options Available"],
    status: "published",
    seats: ["att_01", "att_02", "att_03", "att_04", null, null], // 4 seated, 2 empty
    emailsSentAt: null,
    notes: "Private courtyard reserved. 2 guardian table hosts stationed at entry.",
  },
  {
    id: "evt_bengaluru_vinyl",
    slug: "slow-coffee-vinyl-bengaluru",
    title: "Slow Coffee & Vinyl Sunday",
    city: "Bengaluru",
    neighborhood: "Indiranagar",
    venueName: "Cask & Bean Roastery",
    venueAddress: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    secretAccessCode: "VINYL-411",
    startsAt: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 6 * 24 * 3600 * 1000 + 3 * 3600 * 1000).toISOString(),
    dateDisplay: "This Sunday · 10:00 AM",
    priceInr: 1199,
    category: "coffee_tasting",
    hostName: "Nikhil & Sound Curator Dev",
    hostRole: "Q-Grader & Vinyl Collector",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    theme: "Unhurried conversations over single-origin pour-overs and rare jazz",
    menuPreview: [
      "Cold brew tonic with orange blossom extract",
      "Cupping Flight: 3 distinct anaerobic fermentation Arabicas",
      "Artisanal sourdough tartines with whipped almond butter & fig preserves",
    ],
    dietaryOptions: ["Vegetarian", "Vegan"],
    status: "published",
    seats: ["att_05", "att_06", null, null, null, null], // 2 seated, 4 empty
    emailsSentAt: null,
    notes: "Acoustic room dampening set up. Turntable tuned.",
  },
  {
    id: "evt_hauzkhas_afterdark",
    slug: "after-dark-walk-and-wine-delhi",
    title: "After-Dark Walk & Wine",
    city: "Delhi NCR",
    neighborhood: "Hauz Khas",
    venueName: "The Pavilion at Deer Park & Secluded Loft",
    venueAddress: "Near Hauz Khas Fort, Deer Park Entry, New Delhi 110016",
    secretAccessCode: "TWILIGHT-108",
    startsAt: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 10 * 24 * 3600 * 1000 + 3 * 3600 * 1000).toISOString(),
    dateDisplay: "Next Saturday · 7:00 PM",
    priceInr: 1899,
    category: "after_dark",
    hostName: "Heritage Historian Zoya & Chef Kabir",
    hostRole: "Heritage Guide & Wine Enthusiast",
    hostAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    theme: "Twilight monument walk followed by private courtyard tapas",
    menuPreview: [
      "Welcome spiced cider & seasonal sangria",
      "Tapas: Smoked eggplant dip with za'atar crisps & artisan cheeses",
      "Handmade saffron gnocchi with sage butter",
    ],
    dietaryOptions: ["Vegetarian Tapas Included"],
    status: "draft",
    seats: [null, null, null, null, null, null],
    emailsSentAt: null,
    notes: "Private security escort during the park walk.",
  },
  {
    id: "evt_sunder_nursery_past",
    slug: "sunder-nursery-sunset-supper",
    title: "Sunder Nursery Sunset Salon",
    city: "Delhi NCR",
    neighborhood: "Nizamuddin",
    venueName: "The Glasshouse by the Amphitheatre",
    venueAddress: "Sunder Nursery Gardens, Bharat Scouts and Guides Marg, New Delhi 110013",
    secretAccessCode: "SUNDER-PAST-04",
    startsAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    endsAt: new Date(Date.now() - 7 * 24 * 3600 * 1000 + 4 * 3600 * 1000).toISOString(),
    dateDisplay: "Concluded · Last Sunday",
    priceInr: 2200,
    category: "salon",
    hostName: "Chef Tara Sen",
    hostRole: "Curator",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    theme: "Botanical tastings amidst Mughal heritage ruins",
    menuPreview: [
      "Course 1: Heirloom tomato carpaccio",
      "Course 2: Morel mushroom risotto",
      "Dessert: Lavender honey tart",
    ],
    dietaryOptions: ["Vegetarian"],
    status: "completed",
    seats: ["att_01", "att_02", "att_03", "att_04", "att_05", "att_06"], // Full 6 seated
    emailsSentAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    notes: "Gathering was an extraordinary success. All 6 guests exchanged contact info post-dinner.",
  },
];

export class EventsService {
  // 1. Get all events
  static getEvents(): AdminEvent[] {
    if (typeof window === "undefined") return INITIAL_EVENTS;
    try {
      const stored = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
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

  // 3. Save / overwrite events list
  static saveEvents(events: AdminEvent[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.error("[EventsService] Failed to save events:", e);
    }
  }

  // 4. Create new event
  static createEvent(eventData: Omit<AdminEvent, "id" | "seats">): AdminEvent {
    const events = this.getEvents();
    const newEvent: AdminEvent = {
      ...eventData,
      id: "evt_" + Math.random().toString(36).substring(2, 9),
      seats: [null, null, null, null, null, null],
      emailsSentAt: null,
    };
    const updated = [newEvent, ...events];
    this.saveEvents(updated);
    return newEvent;
  }

  // 5. Update existing event
  static updateEvent(id: string, updates: Partial<AdminEvent>): AdminEvent {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Event not found");

    const updatedEvent = { ...events[index], ...updates };
    events[index] = updatedEvent;
    this.saveEvents(events);
    return updatedEvent;
  }

  // 6. Delete event
  static deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    this.saveEvents(filtered);
    return true;
  }

  // 7. Get all attendees pool
  static getAttendees(): AdminAttendee[] {
    if (typeof window === "undefined") return INITIAL_ATTENDEES;
    try {
      const stored = localStorage.getItem(STORAGE_ATTENDEES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_ATTENDEES_KEY, JSON.stringify(INITIAL_ATTENDEES));
      return INITIAL_ATTENDEES;
    } catch (e) {
      console.error("[EventsService] Failed to load attendees:", e);
      return INITIAL_ATTENDEES;
    }
  }

  // 8. Assign attendee to a seat index (0..5)
  static assignSeat(eventId: string, seatIndex: number, attendeeId: string): AdminEvent {
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    // Clone seats
    const newSeats = [...event.seats];

    // Check if attendee is already seated in another seat in the same event
    const existingIndex = newSeats.findIndex((id) => id === attendeeId);
    if (existingIndex !== -1 && existingIndex !== seatIndex) {
      // Clear previous seat to avoid duplication
      newSeats[existingIndex] = null;
    }

    newSeats[seatIndex] = attendeeId;
    return this.updateEvent(eventId, { seats: newSeats });
  }

  // 9. Unseat an attendee from a seat index (0..5)
  static unassignSeat(eventId: string, seatIndex: number): AdminEvent {
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const newSeats = [...event.seats];
    newSeats[seatIndex] = null;
    return this.updateEvent(eventId, { seats: newSeats });
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

      a.allergies.forEach((alg) => {
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
        seatedAttendees.reduce((acc, a) => acc + a.archetype.dimensions.socialEnergy, 0) /
        seatedCount;
      const avgDepth =
        seatedAttendees.reduce((acc, a) => acc + a.archetype.dimensions.conversationDepth, 0) /
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
  static async sendEventInvitations(eventId: string): Promise<{ success: boolean; dispatchedCount: number }> {
    const event = this.getEventById(eventId);
    if (!event) throw new Error("Event not found");

    const attendees = this.getAttendees();
    const seatedAttendees = event.seats
      .map((id) => (id ? attendees.find((a) => a.id === id) : null))
      .filter((a): a is AdminAttendee => Boolean(a));

    if (seatedAttendees.length === 0) {
      throw new Error("No attendees are seated on this table to email.");
    }

    // Send emails via EmailService
    let sentCount = 0;
    for (const attendee of seatedAttendees) {
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
          },
        });
        sentCount++;
      } catch (err) {
        console.warn(`[EventsService] Could not send to ${attendee.email}:`, err);
      }
    }

    // Mark timestamp in event record
    this.updateEvent(eventId, {
      emailsSentAt: new Date().toISOString(),
    });

    return { success: true, dispatchedCount: sentCount };
  }
}
