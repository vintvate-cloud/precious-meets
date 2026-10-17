import { getSupabaseAdmin } from "./supabase";

export interface EmailPayload {
  to: string;
  subject: string;
  template:
    | "welcome"
    | "quiz_completed"
    | "identity_verified"
    | "booking_confirmed"
    | "booking_cancelled"
    | "sos_incident_alert";
  data: Record<string, any>;
}

export class EmailService {
  private static getApiKey(): string {
    return (
      (typeof process !== "undefined" && process.env?.RESEND_API_KEY) ||
      "re_placeholder_secret"
    );
  }

  private static getFromAddress(): string {
    return (
      (typeof process !== "undefined" && process.env?.RESEND_FROM_EMAIL) ||
      "Precious Meets <invitations@preciousmeets.com>"
    );
  }

  static renderTemplate(template: EmailPayload["template"], data: Record<string, any>): string {
    const brandHeader = `
      <div style="background-color: #691c35; padding: 28px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="font-family: Georgia, serif; color: #f8f2e7; margin: 0; font-size: 26px; font-weight: normal; letter-spacing: -0.5px;">
          Precious<span style="font-style: italic;">meets</span>
        </h1>
        <p style="color: #c6a568; font-family: monospace; font-size: 11px; margin-top: 6px; letter-spacing: 1.5px; text-transform: uppercase;">
          Every meet matters
        </p>
      </div>
    `;

    const brandFooter = `
      <div style="background-color: #f8f2e7; padding: 24px; text-align: center; border-top: 1px solid #e0d7c7; border-radius: 0 0 8px 8px; font-family: sans-serif; font-size: 12px; color: #6b6357;">
        <p style="margin: 0 0 8px 0;">Precious Meets · Curated Real-World Tables & Social Discovery</p>
        <p style="margin: 0;">Mumbai · Bengaluru · Delhi</p>
      </div>
    `;

    let bodyContent = "";

    switch (template) {
      case "welcome":
        bodyContent = `
          <h2 style="font-family: Georgia, serif; color: #171514; font-size: 22px;">Welcome to the table, ${data.name || "friend"}.</h2>
          <p style="color: #4a453f; line-height: 1.6;">You have joined an intentional circle of curious minds, epicureans, and conversationalists across India.</p>
          <p style="color: #4a453f; line-height: 1.6;">Next step: complete your Social Discovery Quiz to be paired with your first curated table.</p>
          <div style="margin: 28px 0; text-align: center;">
            <a href="${data.quizUrl || "http://localhost:5173/quiz"}" style="background-color: #691c35; color: #f8f2e7; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; display: inline-block;">
              Take the Discovery Quiz &rarr;
            </a>
          </div>
        `;
        break;

      case "quiz_completed":
        bodyContent = `
          <h2 style="font-family: Georgia, serif; color: #171514; font-size: 22px;">Your Social Archetype is ready.</h2>
          <p style="color: #4a453f; line-height: 1.6;">We have mapped your social energy and conversational rhythm.</p>
          <div style="background: #e8ecd8; border-left: 4px solid #5f7045; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; margin: 0; color: #5f7045;">Archetype</p>
            <h3 style="font-family: Georgia, serif; font-size: 20px; margin: 4px 0; color: #171514;">${data.archetype || "The Curious Flâneur"}</h3>
            <p style="margin: 0; color: #4a453f; font-size: 14px;">${data.archetypeDescription || ""}</p>
          </div>
        `;
        break;

      case "booking_confirmed":
        bodyContent = `
          <h2 style="font-family: Georgia, serif; color: #171514; font-size: 22px;">Your Seat is Reserved.</h2>
          <p style="color: #4a453f; line-height: 1.6;">We're delighted to welcome you to <strong>${data.experienceTitle}</strong>.</p>
          <div style="background: #fffaf1; border: 1px solid #e0d7c7; padding: 18px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0 0 6px 0;"><strong>Date & Time:</strong> ${data.date}</p>
            <p style="margin: 0 0 6px 0;"><strong>Venue:</strong> ${data.venue}</p>
            <p style="margin: 0 0 6px 0;"><strong>Host:</strong> ${data.host}</p>
            <p style="margin: 0;"><strong>Booking Reference:</strong> <span style="font-family: monospace; font-weight: bold;">${data.reference}</span></p>
          </div>
        `;
        break;

      case "sos_incident_alert":
        bodyContent = `
          <div style="background: #fdf2f2; border: 2px solid #e02424; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="color: #9b1c1c; margin: 0 0 8px 0; font-family: sans-serif;">CRITICAL: Safety SOS Incident Reported</h2>
            <p style="margin: 0; color: #771d1d; font-weight: bold;">Reference: ${data.incidentReference}</p>
          </div>
          <p style="color: #171514;">A user has activated the emergency safety beacon on an active experience.</p>
          <ul style="color: #4a453f; line-height: 1.8;">
            <li><strong>User:</strong> ${data.userName} (${data.userEmail})</li>
            <li><strong>Category:</strong> ${data.category}</li>
            <li><strong>Time:</strong> ${new Date().toUTCString()}</li>
            <li><strong>Booking:</strong> ${data.bookingReference || "Direct Alert"}</li>
            <li><strong>Location Shared:</strong> ${data.locationShared ? `Lat: ${data.latitude}, Lng: ${data.longitude}` : "No coordinates attached"}</li>
          </ul>
        `;
        break;

      default:
        bodyContent = `<p style="color: #4a453f;">${data.message || "Important notification from Precious Meets."}</p>`;
    }

    return `
      <!DOCTYPE html>
      <html>
        <body style="background-color: #f2ebe0; margin: 0; padding: 24px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
            ${brandHeader}
            <div style="padding: 32px 28px;">
              ${bodyContent}
            </div>
            ${brandFooter}
          </div>
        </body>
      </html>
    `;
  }

  static async send(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
    const apiKey = this.getApiKey();
    const html = this.renderTemplate(payload.template, payload.data);

    // If placeholder or mock key, log safely and simulate success
    if (apiKey === "re_placeholder_secret" || !apiKey.startsWith("re_")) {
      console.log(`[EmailService:Mock] To: ${payload.to} | Subject: "${payload.subject}" | Template: ${payload.template}`);
      
      const admin = getSupabaseAdmin();
      await admin.from("email_events").insert({
        recipient_email: payload.to,
        template_name: payload.template,
        resend_id: `mock_resend_${Date.now()}`,
        status: "sent",
      });

      return { success: true, id: `mock_resend_${Date.now()}` };
    }

    // Call Resend REST API
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.getFromAddress(),
          to: [payload.to],
          subject: payload.subject,
          html,
        }),
      });

      const resData = (await response.json()) as { id?: string; message?: string };
      if (!response.ok) {
        throw new Error(`Resend error: ${resData.message || response.statusText}`);
      }

      const admin = getSupabaseAdmin();
      await admin.from("email_events").insert({
        recipient_email: payload.to,
        template_name: payload.template,
        resend_id: resData.id || "resend_api_ok",
        status: "sent",
      });

      return { success: true, id: resData.id };
    } catch (err: any) {
      console.error("[EmailService] Failed to send email:", err);
      return { success: false };
    }
  }
}
