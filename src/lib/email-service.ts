import { getSupabaseAdmin } from "./supabase";
import { sendEmailServer } from "./server-email";

export interface EmailPayload {
  to: string;
  subject?: string;
  from?: string;
  template:
    | "welcome"
    | "quiz_completed"
    | "subscription_activated"
    | "identity_verified"
    | "booking_confirmed"
    | "booking_cancelled"
    | "sos_incident_alert"
    | "application_approved"
    | "application_rejected"
    | "member_credentials"
    | "aadhaar_reverify_required";
  data: Record<string, any>;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
}

export class EmailService {
  /**
   * Universal Resend API key retrieval supporting:
   * 1. Vite browser runtime (import.meta.env.VITE_RESEND_API_KEY)
   * 2. Node / SSR / Server runtime (process.env.RESEND_API_KEY)
   * 3. User configured default key fallback
   */
  private static getApiKey(): string {
    const key =
      (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_RESEND_API_KEY) ||
      (typeof process !== "undefined" && (process.env?.RESEND_API_KEY || process.env?.VITE_RESEND_API_KEY)) ||
      "";
    return String(key).trim();
  }

  /**
   * Verified sender addresses on preciousmeets.com by email category:
   * 1. Invoices & Receipts: Precious Meets Billing <billing@preciousmeets.com>
   * 2. Passes, Seats & Reservations: Precious Meets Concierge <invitations@preciousmeets.com>
   * 3. Membership & Credentials: Precious Meets Membership <membership@preciousmeets.com>
   * 4. Safety & Verification: Precious Meets Safety <safety@preciousmeets.com>
   * 5. General / Welcome: Precious Meets <invitations@preciousmeets.com>
   */
  static getSenderForTemplate(template?: EmailPayload["template"]): string {
    switch (template) {
      case "subscription_activated":
        return "Precious Meets Billing <billing@preciousmeets.com>";
      case "booking_confirmed":
      case "booking_cancelled":
        return "Precious Meets Concierge <invitations@preciousmeets.com>";
      case "application_approved":
      case "application_rejected":
      case "member_credentials":
      case "quiz_completed":
        return "Precious Meets Membership <membership@preciousmeets.com>";
      case "sos_incident_alert":
      case "identity_verified":
      case "aadhaar_reverify_required":
        return "Precious Meets Safety <safety@preciousmeets.com>";
      case "welcome":
      default:
        return "Precious Meets <invitations@preciousmeets.com>";
    }
  }

  /**
   * Resolves the verified sender address for Resend delivery:
   * Prioritizes:
   * 1. Explicit custom sender in payload
   * 2. Role-based sender on preciousmeets.com matched to template
   * 3. Environment variable overrides (VITE_RESEND_FROM_EMAIL / RESEND_FROM_EMAIL)
   * 4. Verified fallback: Precious Meets <invitations@preciousmeets.com>
   */
  private static getFromAddress(template?: EmailPayload["template"], customFrom?: string): string {
    if (customFrom && customFrom.trim()) {
      return customFrom.trim();
    }
    if (template) {
      return this.getSenderForTemplate(template);
    }
    const from =
      (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_RESEND_FROM_EMAIL) ||
      (typeof process !== "undefined" && process.env?.RESEND_FROM_EMAIL) ||
      "Precious Meets <invitations@preciousmeets.com>";
    return String(from).trim();
  }

  /**
   * Intelligent default subject line if subject is omitted in caller
   */
  static getDefaultSubject(template: EmailPayload["template"], data: Record<string, any>): string {
    switch (template) {
      case "welcome":
        return "Welcome to the Table | Precious Meets";
      case "quiz_completed":
        return `Your Social Archetype is Ready (${data.archetype || "Social Discovery"}) | Precious Meets`;
      case "subscription_activated":
        return "Tax Invoice & Payment Receipt | Precious Meets";
      case "identity_verified":
        return "Identity Verified | Precious Meets Membership Dossier";
      case "booking_confirmed":
        return `Your Seat is Confirmed: ${data.experienceTitle || "Curated Gathering"} | Precious Meets`;
      case "booking_cancelled":
        return "Booking Update: Cancellation Confirmed | Precious Meets";
      case "sos_incident_alert":
        return `[CRITICAL SOS] Emergency Incident Reported (${data.incidentReference || "Alert"})`;
      case "application_approved":
        return "Welcome to Precious Meets — Your Application is Officially Approved ✨";
      case "application_rejected":
        return "Update regarding your Precious Meets Membership Application";
      case "member_credentials":
        return "Your Precious Meets Member Sign-in Credentials 🗝️";
      case "aadhaar_reverify_required":
        return "Action Required: Please Re-verify Your Aadhaar Document | Precious Meets";
      default:
        return "Important Notification | Precious Meets";
    }
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
        <p style="margin: 0;">Delhi NCR · 100% Aadhaar Verified</p>
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
            <a href="${data.quizUrl || "http://localhost:8080/quiz"}" style="background-color: #691c35; color: #f8f2e7; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; display: inline-block;">
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

      case "subscription_activated":
        bodyContent = `
          <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #ECE7DE;">
            <div style="display: inline-block; background-color: #EBF3E8; color: #3B6B35; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
              ✓ Payment Confirmed
            </div>
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 36px; font-weight: 700; color: #171514; letter-spacing: -0.5px; line-height: 1; margin: 0;">
              ${data.amount || "₹1,999"}
            </div>
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #736B63; margin-top: 6px;">
              ${data.plan || "Precious Meets Membership"}
            </div>
          </div>

          <div style="padding: 20px 0 16px 0;">
            <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px;">
              <tr>
                <td style="padding: 8px 0; color: #8C827A;">Invoice No.</td>
                <td style="padding: 8px 0; text-align: right; font-family: 'SF Mono', Menlo, Consolas, monospace; font-weight: 600; color: #171514;">
                  ${data.invoiceNumber || "INV-2026-001"}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8C827A; border-top: 1px solid #F0ECE4;">Payment Reference</td>
                <td style="padding: 8px 0; text-align: right; font-family: 'SF Mono', Menlo, Consolas, monospace; font-weight: 600; color: #691C35; border-top: 1px solid #F0ECE4;">
                  ${data.paymentId || "pay_rzp_verified"}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8C827A; border-top: 1px solid #F0ECE4;">Billed To</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500; color: #171514; border-top: 1px solid #F0ECE4;">
                  ${data.name || "Member"}${data.email ? ` <span style="color: #8C827A; font-weight: normal; font-size: 12px;">(${data.email})</span>` : ""}
                </td>
              </tr>
              ${data.memberId ? `
              <tr>
                <td style="padding: 8px 0; color: #8C827A; border-top: 1px solid #F0ECE4;">Member ID</td>
                <td style="padding: 8px 0; text-align: right; font-family: 'SF Mono', Menlo, Consolas, monospace; font-weight: 600; color: #171514; border-top: 1px solid #F0ECE4;">
                  ${data.memberId}
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding: 8px 0; color: #8C827A; border-top: 1px solid #F0ECE4;">Date</td>
                <td style="padding: 8px 0; text-align: right; color: #171514; border-top: 1px solid #F0ECE4;">
                  ${data.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0 4px 0; font-weight: 600; color: #171514; border-top: 1px solid #D8D1C5;">Total Paid</td>
                <td style="padding: 12px 0 4px 0; text-align: right; font-weight: 700; color: #171514; font-size: 15px; border-top: 1px solid #D8D1C5;">
                  ${data.amount || "₹1,999"}
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 18px; text-align: center; margin-top: 4px;">
            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12.5px; color: #554F49; line-height: 1.5;">
              Your member sign-in credentials will be sent to your email shortly.
            </p>
          </div>
        `;
        break;

      case "identity_verified":
        bodyContent = `
          <div style="background: #fbf8f3; border: 1px solid #c6a568; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <div style="display: inline-block; background: #5f7045; color: #f8f2e7; font-family: monospace; font-size: 10px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
              ✓ Government ID Confirmed
            </div>
            <h2 style="font-family: Georgia, serif; color: #171514; font-size: 22px; margin: 0 0 10px 0;">Identity Verified Offline, ${data.name || "Member"}.</h2>
            <p style="color: #4a453f; line-height: 1.6; margin: 0 0 14px 0;">
              Your offline Aadhaar/DigiLocker verification has been reviewed and approved. Your safety and trust rating is 100% verified.
            </p>
            <div style="background: #ffffff; border: 1px solid #e0d7c7; border-radius: 6px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b6357;">Verification Method: <strong style="color: #171514;">${data.method || "DigiLocker / Aadhaar Consent"}</strong></p>
              <p style="margin: 0; font-size: 13px; color: #6b6357;">Member Status: <strong style="color: #5f7045;">Fully Unlocked for 6-Seat Tables</strong></p>
            </div>
          </div>
        `;
        break;

      case "booking_confirmed":
        bodyContent = `
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ECE7DE;">
            <div style="display: inline-block; background-color: #F6EFE6; color: #691C35; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
              Curated Table Invitation
            </div>
            <h2 style="font-family: Georgia, serif; color: #171514; font-size: 24px; margin: 0 0 6px 0; font-weight: normal;">
              Your Seat is Reserved.
            </h2>
            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #736B63; font-size: 13px; line-height: 1.5; margin: 0;">
              We are delighted to invite you to <strong>${data.experienceTitle}</strong>.
            </p>
          </div>

          <div style="padding: 20px 0;">
            <div style="background-color: #FAF8F5; border: 1px solid #EFEAE1; border-radius: 8px; padding: 18px 20px;">
              <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #8C827A; width: 35%;">Date & Time</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #171514;">${data.date}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #8C827A; border-top: 1px solid #F0ECE4;">Venue</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 500; color: #171514; border-top: 1px solid #F0ECE4;">${data.venue}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #8C827A; border-top: 1px solid #F0ECE4;">Host</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 500; color: #171514; border-top: 1px solid #F0ECE4;">${data.host}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #8C827A; border-top: 1px solid #F0ECE4;">Booking Ref</td>
                  <td style="padding: 6px 0; text-align: right; font-family: 'SF Mono', Menlo, Consolas, monospace; font-weight: 600; color: #691C35; border-top: 1px solid #F0ECE4;">${data.reference}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- 24-Hour Action Box: Accept or Reject from Member Dashboard -->
          <div style="background-color: #FDF9F3; border-left: 3px solid #C6A568; border-radius: 6px; padding: 14px 18px; margin-bottom: 22px;">
            <p style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #171514;">
              Action Required within 24 Hours:
            </p>
            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12.5px; color: #554F49; line-height: 1.6;">
              You can accept or reject this invitation directly from your <strong>Member Dashboard</strong>. If you do not accept within 24 hours, your place will be given to someone else on the curated waitlist to preserve table parity.
            </p>
          </div>

          <div style="text-align: center; margin: 20px 0 8px 0;">
            <a href="${data.dashboardUrl || 'http://localhost:8080/dashboard'}" style="background-color: #691C35; color: #FAF7F2; padding: 13px 32px; border-radius: 9999px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; font-size: 13px; display: inline-block; box-shadow: 0 2px 8px rgba(105, 28, 53, 0.2);">
              Open Member Dashboard to Respond &rarr;
            </a>
          </div>
        `;
        break;

      case "booking_cancelled":
        bodyContent = `
          <h2 style="font-family: Georgia, serif; color: #171514; font-size: 22px;">Booking Cancellation Confirmed</h2>
          <p style="color: #4a453f; line-height: 1.6;">Your seat reservation for <strong>${data.experienceTitle || "Curated Gathering"}</strong> has been released.</p>
          <div style="background: #fffaf1; border: 1px solid #e0d7c7; padding: 16px; margin: 16px 0; border-radius: 6px;">
            <p style="margin: 0; color: #6b6357;">Booking Reference: <span style="font-family: monospace; font-weight: bold; color: #691c35;">${data.reference || "N/A"}</span></p>
            <p style="margin: 6px 0 0 0; color: #4a453f;">${data.refundNote || "Any refundable credits or passes have been adjusted in your account."}</p>
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

      case "application_approved":
        bodyContent = `
          <div style="background: #fbf8f3; border: 1px solid #c6a568; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <div style="display: inline-block; background: #5f7045; color: #f8f2e7; font-family: monospace; font-size: 10px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
              ✓ Application Officially Approved
            </div>
            <h2 style="font-family: Georgia, serif; color: #171514; font-size: 24px; margin: 0 0 8px 0;">Welcome to Precious Meets, ${data.name || "Member"}.</h2>
            <p style="color: #4a453f; line-height: 1.6; margin: 0 0 16px 0;">
              Your membership application, conversational vibe profile, and identity verification have been formally reviewed and approved by the curation committee.
            </p>
            
            <div style="background: #ffffff; border: 1px solid #e0d7c7; border-radius: 6px; padding: 18px; margin: 18px 0;">
              <table style="width: 100%; font-size: 13px; color: #4a453f; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6b6357;">Dossier Pass ID:</td>
                  <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: bold; color: #691c35;">${data.memberId || data.reference || "PM-MEMBER-01"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b6357;">Vibe Archetype:</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #5f7045;">${data.archetype || "Curious Flâneur"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b6357;">Aadhaar Verification:</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #5f7045;">✓ 100% Verified Offline</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b6357;">Membership Tier:</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #171514;">${data.plan || "Precious Meets Member"}</td>
                </tr>
              </table>
            </div>

            ${
              data.reviewNotes
                ? `<div style="background: #e8ecd8; border-left: 3px solid #5f7045; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-size: 12px; color: #3b4528;">
                    <strong>Note from Curation Committee:</strong><br />${data.reviewNotes}
                  </div>`
                : ""
            }

            <p style="color: #4a453f; font-size: 13px; line-height: 1.6;">
              Your member status is active immediately. You may now book exclusive 6-seat tables, discover secret dinners, and view matched seating.
            </p>

            <div style="margin: 24px 0 8px 0; text-align: center;">
              <a href="${data.dashboardUrl || "http://localhost:8080/dashboard"}" style="background-color: #691c35; color: #f8f2e7; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block;">
                Explore Curated Tables &rarr;
              </a>
            </div>
          </div>
        `;
        break;

      case "application_rejected":
        bodyContent = `
          <div style="background: #fffaf1; border: 1px solid #e0d7c7; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <div style="display: inline-block; background: #691c35; color: #f8f2e7; font-family: monospace; font-size: 10px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
              Membership Application Update
            </div>
            <h2 style="font-family: Georgia, serif; color: #171514; font-size: 22px; margin: 0 0 10px 0;">Dear ${data.name || "Applicant"},</h2>
            <p style="color: #4a453f; line-height: 1.6; margin: 0 0 14px 0;">
              Thank you for taking the time to share your conversational rhythm and applying to join Precious Meets.
            </p>
            <p style="color: #4a453f; line-height: 1.6; margin: 0 0 16px 0;">
              To protect the warmth and chemistry of our 6-person dinner tables, every group is curated with limited seats. At this time, our team is unable to accept your membership application for the current season.
            </p>

            ${
              data.rejectionReason
                ? `<div style="background: #fbf2f4; border-left: 3px solid #691c35; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-size: 13px; color: #52182b;">
                    <strong>Curator Feedback:</strong><br />${data.rejectionReason}
                  </div>`
                : ""
            }

            <p style="color: #4a453f; font-size: 13px; line-height: 1.6;">
              ${
                data.refundNote ||
                "If your payment was processed, a full 100% refund has been initiated back to your original payment method via Razorpay within 3–5 business days."
              }
            </p>

            <p style="color: #6b6357; font-size: 12px; line-height: 1.6; margin-top: 20px;">
              You are welcome to re-apply for upcoming meets after 90 days. We wish you wonderful conversations ahead.
            </p>
          </div>
        `;
        break;

      case "member_credentials":
        bodyContent = `
          <div style="background: #fbf8f3; border: 1px solid #c6a568; border-radius: 8px; padding: 26px; margin-bottom: 24px;">
            <div style="display: inline-block; background: #691c35; color: #f8f2e7; font-family: monospace; font-size: 10px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
              Member Portal Access
            </div>
            <h2 style="font-family: Georgia, serif; color: #171514; font-size: 24px; margin: 0 0 8px 0;">Your Sign-In Credentials, ${data.name || "Member"}.</h2>
            <p style="color: #4a453f; line-height: 1.6; margin: 0 0 18px 0;">
              Your Precious Meets membership profile has been formally verified and approved by the curation committee. Below are your confidential credentials to access your member portal and RSVP for secret curated tables.
            </p>

            <div style="background: #ffffff; border: 2px dashed #c6a568; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <div style="margin-bottom: 14px;">
                <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #6b6357; display: block; margin-bottom: 4px;">Sign-In Email Address</span>
                <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #171514;">${data.email}</span>
              </div>
              <div>
                <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #6b6357; display: block; margin-bottom: 4px;">Auto-Generated Secure Password</span>
                <span style="display: inline-block; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #691c35; background: #fdf5f7; border: 1px solid #f2c7d2; padding: 6px 14px; border-radius: 6px; letter-spacing: 1.2px;">
                  ${data.password}
                </span>
              </div>
            </div>

            <div style="margin: 28px 0; text-align: center;">
              <a href="${data.signInUrl || "http://localhost:8080/login?email=" + encodeURIComponent(data.email || "")}" style="background-color: #691c35; color: #f8f2e7; padding: 14px 34px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; box-shadow: 0 3px 10px rgba(105, 28, 53, 0.25);">
                Sign In to Your Member Portal &rarr;
              </a>
            </div>

            <div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #7c2d12; font-size: 12.5px; line-height: 1.6;">
                <strong>Security Notice:</strong> Please keep these credentials confidential and do not share them with anyone. For your personal protection, you may update your password at any time in your profile settings after logging in.
              </p>
            </div>
          </div>
        `;
        break;

      case "aadhaar_reverify_required":
        bodyContent = `
          <div style="background: #fbf8f3; border: 1px solid #c6a568; border-radius: 8px; padding: 26px; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #fef3c7; color: #92400e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; border: 1px solid #fde68a;">
              ⚠️ Identity Reverification Required
            </div>
            <h2 style="font-family: Georgia, serif; color: #171514; font-size: 24px; margin: 0 0 8px 0; font-weight: normal;">
              Action Required: Please Re-verify Your Aadhaar Document
            </h2>
            <p style="color: #4a453f; line-height: 1.6; margin: 0 0 16px 0;">
              Dear ${data.name || "Member"}, during our curation and trust audit, our verification team noticed that your uploaded Aadhaar document requires your attention.
            </p>

            <div style="background: #ffffff; border-left: 4px solid #b45309; border-radius: 6px; padding: 16px 20px; margin: 18px 0; border-top: 1px solid #f1ece4; border-right: 1px solid #f1ece4; border-bottom: 1px solid #f1ece4;">
              <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #92400e; font-weight: bold; display: block; margin-bottom: 6px;">
                Curator Feedback / Reason:
              </span>
              <p style="margin: 0; color: #171514; font-size: 13.5px; line-height: 1.6; font-style: italic;">
                "${data.feedback || "Your uploaded Aadhaar card document was blurry, partially cut off, or unreadable. Please upload a clear, legible copy."}"
              </p>
            </div>

            <p style="color: #4a453f; line-height: 1.6; margin: 16px 0;">
              To protect the trust and safety of all curated 6-person dinner tables, please click below to upload a clear copy of your Aadhaar Card (front or full PDF).
            </p>

            <div style="margin: 28px 0 20px 0; text-align: center;">
              <a href="${data.reverifyUrl || "https://preciousmeets.com/verify-identity"}" style="background-color: #691c35; color: #f8f2e7; padding: 14px 34px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; box-shadow: 0 3px 10px rgba(105, 28, 53, 0.25);">
                Re-verify Aadhaar Document &rarr;
              </a>
            </div>

            <div style="background: #f4efe6; border-radius: 6px; padding: 12px 16px; margin-top: 22px;">
              <p style="margin: 0; color: #6b6357; font-size: 11.5px; line-height: 1.5;">
                <strong>UIDAI Offline Privacy Guarantee:</strong> In strict compliance with Indian DPDP Act and UIDAI guidelines, we never store raw biometric data or 12-digit Aadhaar numbers. Your document is processed with enterprise end-to-end encryption.
              </p>
            </div>
          </div>
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

  static async send(payload: EmailPayload): Promise<EmailSendResult> {
    const apiKey = this.getApiKey();
    const fromAddress = this.getFromAddress(payload.template, payload.from);
    const subject = payload.subject || this.getDefaultSubject(payload.template, payload.data);
    const html = this.renderTemplate(payload.template, payload.data);

    // 1. Client-Side Browser Dispatch:
    // Route via server endpoint to completely eliminate browser CORS restrictions
    if (typeof window !== "undefined") {
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddress,
            to: payload.to,
            subject,
            html,
          }),
        });

        const resData = await response.json();
        if (response.ok && (resData.ok || resData.id || resData.data?.id)) {
          const emailId = resData.id || resData.data?.id || "resend_api_ok";
          console.log(`[EmailService] Live email successfully dispatched via /api/send-email to ${payload.to} (ID: ${emailId})`);
          return { success: true, id: emailId };
        } else {
          const errMsg = resData.error || resData.data?.message || resData.message || `Resend error HTTP ${response.status}`;
          console.error("[EmailService] /api/send-email returned failure:", errMsg);
          return { success: false, error: errMsg };
        }
      } catch (clientErr: any) {
        console.warn("[EmailService] /api/send-email failed, attempting RPC server function:", clientErr);
        try {
          const rpcRes = await sendEmailServer({
            data: {
              from: fromAddress,
              to: payload.to,
              subject,
              html,
            },
          });
          if (rpcRes.ok && rpcRes.data?.id) {
            console.log(`[EmailService] Live email successfully dispatched via RPC to ${payload.to} (ID: ${rpcRes.data.id})`);
            return { success: true, id: rpcRes.data.id };
          }
          return { success: false, error: rpcRes.data?.message || "Failed to send email via RPC" };
        } catch (rpcErr: any) {
          console.error("[EmailService] RPC send failed:", rpcErr);
          return { success: false, error: rpcErr.message || String(rpcErr) };
        }
      }
    }

    // 2. Server-Side Dispatch (Node.js runtime / SSR / Worker):
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [payload.to],
          subject,
          html,
        }),
      });

      const resData = (await response.json()) as { id?: string; message?: string; error?: any };
      if (!response.ok) {
        throw new Error(`Resend error: ${resData.message || JSON.stringify(resData.error) || response.statusText}`);
      }

      try {
        const admin = getSupabaseAdmin();
        await admin.from("email_events").insert({
          recipient_email: payload.to,
          template_name: payload.template,
          resend_id: resData.id || "resend_api_ok",
          status: "sent",
        });
      } catch (dbErr) {
        // Non-fatal audit log
      }

      console.log(`[EmailService] Live email dispatched directly from server to ${payload.to} (ID: ${resData.id})`);
      return { success: true, id: resData.id || "resend_api_ok" };
    } catch (err: any) {
      console.error("[EmailService] Direct server send failed:", err);
      return { success: false, error: err.message || String(err) };
    }
  }

  // Alias for backward compatibility with calls to sendEmail
  static async sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
    return this.send(payload);
  }
}
