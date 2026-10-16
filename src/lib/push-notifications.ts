import webpush from "web-push";
import { getSupabaseAdmin } from "./supabase";

export interface PushMessagePayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

export class PushNotificationService {
  private static isConfigured = false;

  private static configure() {
    if (this.isConfigured) return;

    const publicKey =
      (typeof process !== "undefined" && process.env?.PUSH_NOTIFICATION_PUBLIC_KEY) ||
      (import.meta as any).env?.VITE_PUSH_NOTIFICATION_PUBLIC_KEY;
    const privateKey =
      typeof process !== "undefined" ? process.env?.PUSH_NOTIFICATION_PRIVATE_KEY : undefined;
    const subject =
      (typeof process !== "undefined" && process.env?.PUSH_NOTIFICATION_SUBJECT) ||
      "mailto:security@preciousmeets.com";

    if (publicKey && privateKey && publicKey !== "your_vapid_public_key_here") {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.isConfigured = true;
    }
  }

  /**
   * Save a browser push subscription for a user
   */
  static async saveSubscription(userId: string, subscription: PushSubscriptionJSON) {
    const admin = getSupabaseAdmin();
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      throw new Error("Invalid PushSubscription payload");
    }

    await admin.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        is_active: true,
      },
      { onConflict: "endpoint" },
    );

    return { success: true };
  }

  /**
   * Sends push notification to a specific user or broadcast to attendees
   */
  static async sendToUser(userId: string, payload: PushMessagePayload) {
    this.configure();
    const admin = getSupabaseAdmin();

    const { data: subs, error } = await admin
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error || !subs || subs.length === 0) {
      return { sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const sub of subs) {
      try {
        if (this.isConfigured) {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify(payload),
          );
        } else {
          console.log(`[PushNotification:Mock] User: ${userId} | ${payload.title} - ${payload.body}`);
        }
        sent++;
      } catch (err: any) {
        failed++;
        // If expired or gone (410/404), mark inactive
        if (err.statusCode === 410 || err.statusCode === 404) {
          await admin.from("push_subscriptions").update({ is_active: false }).eq("id", sub.id);
        }
      }
    }

    // Log notification
    await admin.from("notification_logs").insert({
      user_id: userId,
      channel: "push",
      title: payload.title,
      body: payload.body,
      status: failed > 0 && sent === 0 ? "failed" : "sent",
    });

    return { sent, failed };
  }
}
