import { getSupabaseAdmin } from "./supabase";
import { EmailService } from "./email-service";

export interface CreateSosIncidentParams {
  userId: string;
  userEmail: string;
  userName: string;
  bookingId?: string;
  bookingReference?: string;
  category: "emergency" | "discomfort" | "harassment" | "medical" | "venue_safety" | "other";
  userNotes?: string;
  latitude?: number;
  longitude?: number;
  locationShared: boolean;
}

export class SosService {
  /**
   * Creates an active SOS safety incident and triggers administrator escalation
   */
  static async triggerSosIncident(params: CreateSosIncidentParams) {
    const admin = getSupabaseAdmin();
    const incidentReference = `SOS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 1. Insert incident record
    const { data: incident, error } = await admin
      .from("safety_incidents")
      .insert({
        incident_reference: incidentReference,
        user_id: params.userId,
        booking_id: params.bookingId || null,
        category: params.category,
        user_notes: params.userNotes || "Emergency beacon activated via user app.",
        latitude: params.latitude || null,
        longitude: params.longitude || null,
        location_shared: params.locationShared,
        status: "open",
      })
      .select()
      .single();

    if (error) {
      console.error("[SosService] Failed to create incident in DB:", error);
    }

    // 2. Add audit event
    if (incident) {
      await admin.from("safety_incident_events").insert({
        incident_id: incident.id,
        actor_id: params.userId,
        action: "BEACON_ACTIVATED",
        details: `Beacon triggered with category: ${params.category}. Location shared: ${params.locationShared}`,
      });
    }

    // 3. Dispatch admin email notification
    const adminEmails =
      (typeof process !== "undefined" && process.env?.ADMIN_EMAILS?.split(",")) || [
        "safety@preciousmeets.com",
      ];

    for (const email of adminEmails) {
      await EmailService.send({
        to: email.trim(),
        subject: `[EMERGENCY SOS] Urgent Incident ${incidentReference} Reported`,
        template: "sos_incident_alert",
        data: {
          incidentReference,
          userName: params.userName,
          userEmail: params.userEmail,
          category: params.category,
          bookingReference: params.bookingReference,
          locationShared: params.locationShared,
          latitude: params.latitude,
          longitude: params.longitude,
        },
      });
    }

    return {
      success: true,
      incidentReference,
      emergencyHotline: "112", // National Emergency Helpline (India)
      womenHelpline: "1091",
      message:
        "Emergency SOS beacon registered. Our safety dispatch has been alerted. If in immediate danger, please dial 112 directly.",
    };
  }

  /**
   * User or admin marks as false alarm or resolved
   */
  static async updateIncidentStatus(
    incidentId: string,
    actorId: string,
    status: "acknowledged" | "in_progress" | "resolved" | "closed" | "false_alarm",
    notes?: string,
  ) {
    const admin = getSupabaseAdmin();

    await admin
      .from("safety_incidents")
      .update({
        status,
        resolution_notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", incidentId);

    await admin.from("safety_incident_events").insert({
      incident_id: incidentId,
      actor_id: actorId,
      action: `STATUS_${status.toUpperCase()}`,
      details: notes || `Status updated to ${status}`,
    });

    return { success: true };
  }
}
