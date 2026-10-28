import { describe, expect, it, beforeEach, vi } from "vitest";
import { ApplicationsService, MemberApplication } from "@/lib/applications-service";
import { VerificationsService } from "@/lib/verifications-service";
import { EventsService, AdminEvent } from "@/lib/events-service";
import { isDeletedUser, clearDeletedBlacklist } from "@/lib/deleted-users";
import { supabase } from "@/lib/supabase";

vi.spyOn(supabase, "from").mockReturnValue({
  delete: () => ({
    eq: () => Promise.resolve({ error: null }),
    ilike: () => Promise.resolve({ error: null }),
  }),
  update: () => ({
    eq: () => Promise.resolve({ error: null }),
    ilike: () => Promise.resolve({ error: null }),
  }),
  select: () => ({
    order: () => Promise.resolve({ data: [], error: null }),
  }),
} as any);

const testApp: MemberApplication = {
  id: "test-user-uuid-1234",
  applicationReference: "PM-8411",
  status: "pending_review",
  membershipStatus: "paid_pending_credentials",
  applicantName: "Charvi Madan",
  applicantEmail: "charvimadan2001@gmail.com",
  applicantPhone: "+91 9953904222",
  applicantCity: "Delhi NCR",
  archetypeTitle: "The Playful Wit",
  archetypeDescription: "Joyful connector",
  archetypeTraits: ["Spontaneous", "Witty"],
  socialEnergyScore: 80,
  conversationDepthScore: 46,
  playfulnessScore: 90,
  curiosityScore: 70,
  adventureScore: 60,
  dietaryPreference: "Vegetarian",
  allergies: [],
  personalBoundaries: [],
  sharedInterests: [],
  quizAnswers: [],
  quizCompletedAt: "2026-10-27T08:00:00Z",
  paymentStatus: "paid",
  paymentAmountInr: 1999,
  paymentPlanTitle: "Precious Meets Membership",
  paidAt: "2026-10-27T08:30:00Z",
  identityStatus: "pending",
  credentialsSent: false,
  createdAt: "2026-10-27T08:00:00Z",
  updatedAt: "2026-10-27T08:30:00Z",
};

const testEvent: AdminEvent = {
  id: "evt_test_delhi_1",
  slug: "delhi-table",
  title: "Delhi Supper Club",
  city: "Delhi NCR",
  neighborhood: "Mehrauli",
  venueName: "The Olive Room",
  venueAddress: "One Style Mile, Mehrauli",
  secretAccessCode: "OLIVE-101",
  startsAt: "2026-11-01T19:30:00Z",
  endsAt: "2026-11-01T22:30:00Z",
  dateDisplay: "Sunday, Nov 1",
  timeDisplay: "7:30 PM",
  coverImage: "https://example.com/cover.jpg",
  status: "published",
  hostName: "Aarav",
  hostRole: "Curator",
  seats: ["test-user-uuid-1234", null, null, null, null, null],
  seatAcceptances: {
    "test-user-uuid-1234": { status: "pending", emailSent: true },
  },
};

describe("Permanent User Deletion Lifecycle", () => {
  beforeEach(() => {
    localStorage.clear();
    clearDeletedBlacklist();

    // Populate applications
    localStorage.setItem(
      "precious_meets_member_applications_dossiers",
      JSON.stringify([testApp])
    );

    // Populate verifications queue
    localStorage.setItem(
      "precious_meets_verification_queue_v1",
      JSON.stringify([
        {
          id: `ver_${testApp.id}`,
          userName: testApp.applicantName,
          email: testApp.applicantEmail,
          phone: testApp.applicantPhone,
          method: "aadhaar_card_upload",
          status: "pending",
          requestedAt: "Today",
        },
      ])
    );

    // Populate events
    EventsService.saveEvents([testEvent]);
  });

  it("permanently deletes user from VerificationsService and cascades to dossiers and attendees pool", async () => {
    // Verify initial presence
    expect(isDeletedUser(testApp.applicantEmail, testApp.id)).toBe(false);
    expect(VerificationsService.getQueue().some((q) => q.email === testApp.applicantEmail)).toBe(true);
    expect(ApplicationsService.getApplications().some((a) => a.applicantEmail === testApp.applicantEmail)).toBe(true);
    expect(EventsService.getAttendees().some((att) => att.email === testApp.applicantEmail)).toBe(true);

    // Verify user was initially seated at Seat #1
    const initialEvent = EventsService.getEventById(testEvent.id);
    expect(initialEvent?.seats[0]).toBe("test-user-uuid-1234");
    expect(initialEvent?.seatAcceptances?.["test-user-uuid-1234"]).toBeDefined();

    // Perform deletion from Verifications Queue (Screenshot 1 action)
    VerificationsService.deleteRecord(`ver_${testApp.id}`, testApp.applicantEmail);

    // Verify blacklist registration
    expect(isDeletedUser(testApp.applicantEmail, testApp.id)).toBe(true);

    // 1. Verify gone from Verifications Queue
    const remainingQueue = VerificationsService.getQueue();
    expect(remainingQueue.some((q) => q.email === testApp.applicantEmail)).toBe(false);

    // 2. Verify gone from User Dossiers (Screenshot 2)
    const remainingDossiers = ApplicationsService.getApplications();
    expect(remainingDossiers.some((a) => a.applicantEmail === testApp.applicantEmail)).toBe(false);

    // 3. Verify gone from Attendees Pool (Screenshot 3 - Curate Seat modal)
    const remainingAttendees = EventsService.getAttendees();
    expect(remainingAttendees.some((att) => att.email === testApp.applicantEmail)).toBe(false);

    // 4. Verify unseated from event table room
    const updatedEvent = EventsService.getEventById(testEvent.id);
    expect(updatedEvent?.seats[0]).toBeNull();
    expect(updatedEvent?.seatAcceptances?.["test-user-uuid-1234"]).toBeUndefined();
  });

  it("permanently deletes user when deleted from User Dossiers", async () => {
    // Delete from ApplicationsService (Screenshot 2 dossier delete action)
    await ApplicationsService.deleteApplication(testApp.id, testApp.applicantEmail);
    VerificationsService.deleteRecord(testApp.id, testApp.applicantEmail);

    expect(isDeletedUser(testApp.applicantEmail, testApp.id)).toBe(true);
    expect(ApplicationsService.getApplications().some((a) => a.applicantEmail === testApp.applicantEmail)).toBe(false);
    expect(VerificationsService.getQueue().some((q) => q.email === testApp.applicantEmail)).toBe(false);
    expect(EventsService.getAttendees().some((att) => att.email === testApp.applicantEmail)).toBe(false);

    const updatedEvent = EventsService.getEventById(testEvent.id);
    expect(updatedEvent?.seats[0]).toBeNull();
  });

  it("prevents deleted user from reappearing even if stale records exist in cache", () => {
    // Delete user
    VerificationsService.deleteRecord(testApp.id, testApp.applicantEmail);

    // Simulate stale background sync writing user back to raw localStorage
    const currentQueue = JSON.parse(localStorage.getItem("precious_meets_verification_queue_v1") || "[]");
    currentQueue.push({
      id: `ver_${testApp.id}`,
      userName: testApp.applicantName,
      email: testApp.applicantEmail,
      status: "pending",
    });
    localStorage.setItem("precious_meets_verification_queue_v1", JSON.stringify(currentQueue));

    // Queue query must still exclude them due to active blacklist
    expect(VerificationsService.getQueue().some((q) => q.email === testApp.applicantEmail)).toBe(false);
    expect(EventsService.getAttendees().some((att) => att.email === testApp.applicantEmail)).toBe(false);
  });
});
