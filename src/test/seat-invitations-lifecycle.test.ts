import { describe, expect, it, beforeEach, vi } from "vitest";
import { EventsService, AdminEvent, AdminAttendee, UserSeatInvitation } from "@/lib/events-service";
import { EmailService } from "@/lib/email-service";

const MOCK_EVENTS_KEY = "precious_meets_admin_events_v2";
const MOCK_ATTENDEES_KEY = "precious_meets_admin_attendees_v2";
const MOCK_INVITATIONS_KEY = "precious_meets_user_invitations_v1";
const MOCK_DOSSIERS_KEY = "precious_meets_member_applications_dossiers";

const mockApplication = {
  id: "att-test-999",
  applicationReference: "PM-TEST-999",
  status: "approved",
  membershipStatus: "active",
  applicantName: "Rajat Jha",
  applicantEmail: "jhaderajat@gmail.com",
  applicantPhone: "+91 98765 43210",
  applicantCity: "Delhi NCR",
  archetypeTitle: "The Cultured Connoisseur",
  archetypeDescription: "Deep thinker and conversationalist",
  archetypeTraits: ["Curious", "Cultured"],
  socialEnergyScore: 80,
  conversationDepthScore: 90,
  playfulnessScore: 70,
  curiosityScore: 85,
  adventureScore: 75,
  dietaryPreference: "Vegetarian",
  allergies: [],
  personalBoundaries: [],
  sharedInterests: [],
  quizAnswers: [],
  quizCompletedAt: "2026-10-25T09:30:00Z",
  paymentStatus: "paid",
  paymentAmountInr: 1999,
  paymentPlanTitle: "Membership",
  paidAt: "2026-10-25T10:00:00Z",
  identityStatus: "verified",
  identityProvider: "aadhaar_card_upload",
  credentialsSent: true,
  createdAt: "2026-10-25T09:30:00Z",
  updatedAt: "2026-10-25T10:00:00Z",
};

const mockAttendee: AdminAttendee = {
  id: "att-test-999",
  name: "Rajat Jha",
  email: "jhaderajat@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  city: "Delhi NCR",
  gender: "female",
  archetype: {
    title: "The Cultured Connoisseur",
    description: "Deep thinker and conversationalist",
    dimensions: {
      socialEnergy: 80,
      conversationDepth: 90,
      curiosity: 85,
      adventure: 75,
    },
  },
  dietary: "Vegetarian",
  allergies: [],
  identityVerified: true,
  memberTier: "Private Circle Member",
  memberId: "PM-TEST-999",
};

const mockEvent: AdminEvent = {
  id: "evt_test_gathering_101",
  slug: "test-supper-gathering",
  title: "A Night of Philosophy & Gastronomy",
  city: "Delhi NCR",
  neighborhood: "Sunder Nursery",
  venueName: "The Glasshouse Conservatory",
  venueAddress: "Heritage Pavilion, Nizamuddin, New Delhi",
  secretAccessCode: "GLASS-802",
  startsAt: "2026-11-15T19:00:00Z",
  endsAt: "2026-11-15T22:30:00Z",
  dateDisplay: "Saturday, 15 Nov · 7:00 PM",
  coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  hostName: "Kavita Singhania",
  hostRole: "Art Historian & Table Host",
  seats: [null, null, null, null, null, null],
  status: "published",
  theme: "Intimate conversation under starlit glass canopy",
  seatAcceptances: {},
};

describe("Seat Invitations Lifecycle & Cross-Device Sync", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(MOCK_DOSSIERS_KEY, JSON.stringify([mockApplication]));
    localStorage.setItem(MOCK_EVENTS_KEY, JSON.stringify([mockEvent]));
    localStorage.setItem(MOCK_ATTENDEES_KEY, JSON.stringify([mockAttendee]));
    localStorage.setItem(MOCK_INVITATIONS_KEY, JSON.stringify([]));

    vi.spyOn(EmailService, "sendEmail").mockResolvedValue({
      success: true,
      id: "mock-resend-dispatch-id-777",
    });
  });

  it("allocates a seat and auto-generates a user seat invitation", () => {
    const updated = EventsService.assignSeat(mockEvent.id, 0, mockAttendee.id);
    expect(updated.seats[0]).toBe(mockAttendee.id);

    const userInvitations = EventsService.getUserInvitations(mockAttendee.email);
    expect(userInvitations.length).toBe(1);
    expect(userInvitations[0]?.eventId).toBe(mockEvent.id);
    expect(userInvitations[0]?.attendeeEmail).toBe(mockAttendee.email);
    expect(userInvitations[0]?.seatNumber).toBe(1);
    expect(userInvitations[0]?.status).toBe("pending");
  });

  it("dispatches pass emails and sets emailSent=true with direct dashboard link", async () => {
    EventsService.assignSeat(mockEvent.id, 0, mockAttendee.id);

    const dispatchResult = await EventsService.sendEventInvitations(mockEvent.id);
    expect(dispatchResult.success).toBe(true);
    expect(dispatchResult.dispatchedCount).toBe(1);

    // Verify email was sent with link
    expect(EmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockAttendee.email,
        template: "booking_confirmed",
        data: expect.objectContaining({
          dashboardUrl: expect.stringContaining("/dashboard?tab=requests"),
        }),
      })
    );

    // Verify event acceptance record
    const event = EventsService.getEventById(mockEvent.id);
    expect(event?.seatAcceptances?.[mockAttendee.id]?.emailSent).toBe(true);
  });

  it("allows the member to accept the seat invitation and reveals Door PIN", () => {
    EventsService.assignSeat(mockEvent.id, 0, mockAttendee.id);
    const invitations = EventsService.getUserInvitations(mockAttendee.email);
    const inv = invitations[0]!;

    const accepted = EventsService.respondToInvitation(inv.id, "accepted");
    expect(accepted.status).toBe("accepted");
    expect(accepted.respondedAt).toBeDefined();

    // Verify event reflects acceptance
    const event = EventsService.getEventById(mockEvent.id);
    expect(event?.seatAcceptances?.[mockAttendee.id]?.status).toBe("accepted");

    // Verify RSVP list updated
    const savedRsvps = JSON.parse(localStorage.getItem("precious_meets_member_rsvps") || "[]");
    expect(savedRsvps).toContain(mockEvent.id);
  });

  it("allows the member to decline the seat invitation with reason", () => {
    EventsService.assignSeat(mockEvent.id, 0, mockAttendee.id);
    const invitations = EventsService.getUserInvitations(mockAttendee.email);
    const inv = invitations[0]!;

    const declined = EventsService.respondToInvitation(inv.id, "declined", "Traveling out of town");
    expect(declined.status).toBe("declined");
    expect(declined.declineReason).toBe("Traveling out of town");

    // Verify event reflects declined status
    const event = EventsService.getEventById(mockEvent.id);
    expect(event?.seatAcceptances?.[mockAttendee.id]?.status).toBe("declined");
    expect(event?.seatAcceptances?.[mockAttendee.id]?.declineReason).toBe("Traveling out of town");
  });

  it("unseating an attendee removes their invitation", () => {
    EventsService.assignSeat(mockEvent.id, 0, mockAttendee.id);
    expect(EventsService.getUserInvitations(mockAttendee.email).length).toBe(1);

    EventsService.unassignSeat(mockEvent.id, 0);
    expect(EventsService.getUserInvitations(mockAttendee.email).length).toBe(0);
  });
});
