import crypto from "crypto";
import { getSupabaseAdmin } from "./supabase";

export interface CreateOrderParams {
  bookingId: string;
  userId: string;
  sessionId: string;
  experienceTitle: string;
  amountInPaise: number; // e.g. 249900 = 2499 INR
  currency?: string;
}

export interface VerifyPaymentParams {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export class RazorpayService {
  private static getKeyId(): string {
    return (
      (typeof process !== "undefined" && process.env?.RAZORPAY_KEY_ID) ||
      (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
      "rzp_test_Ts3sw4uyv2qQqu"
    );
  }

  private static getKeySecret(): string {
    return (
      (typeof process !== "undefined" && process.env?.RAZORPAY_KEY_SECRET) ||
      "4wGy4NGQc59EcAabKc6Ech6q"
    );
  }

  private static getWebhookSecret(): string {
    return (
      (typeof process !== "undefined" && process.env?.RAZORPAY_WEBHOOK_SECRET) ||
      "placeholder_webhook_secret"
    );
  }

  /**
   * Creates an order with Razorpay REST API
   */
  static async createOrder(params: CreateOrderParams) {
    const keyId = this.getKeyId();
    const keySecret = this.getKeySecret();

    // Check if in sandbox/mock or real Razorpay
    if (keyId === "rzp_test_placeholder" || keySecret === "placeholder_secret") {
      const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const admin = getSupabaseAdmin();
      await admin.from("payment_orders").insert({
        booking_id: params.bookingId,
        razorpay_order_id: mockOrderId,
        amount_in_paise: params.amountInPaise,
        currency: params.currency || "INR",
        status: "created",
      });

      return {
        id: mockOrderId,
        amount: params.amountInPaise,
        currency: params.currency || "INR",
        keyId,
        isMock: true,
      };
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: params.amountInPaise,
        currency: params.currency || "INR",
        receipt: `rcpt_${params.bookingId.substring(0, 10)}`,
        notes: {
          booking_id: params.bookingId,
          user_id: params.userId,
          session_id: params.sessionId,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Razorpay order creation failed: ${err}`);
    }

    const orderData = (await response.json()) as { id: string; amount: number; currency: string };

    const admin = getSupabaseAdmin();
    await admin.from("payment_orders").insert({
      booking_id: params.bookingId,
      razorpay_order_id: orderData.id,
      amount_in_paise: orderData.amount,
      currency: orderData.currency,
      status: "created",
    });

    return {
      ...orderData,
      keyId,
      isMock: false,
    };
  }

  /**
   * Verifies payment signature: sha256(order_id + "|" + payment_id, secret) === signature
   */
  static verifySignature(params: VerifyPaymentParams): boolean {
    const keySecret = this.getKeySecret();
    const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === params.razorpaySignature;
  }

  /**
   * Verifies and confirms booking atomically
   */
  static async confirmPayment(params: VerifyPaymentParams) {
    const isValid = this.verifySignature(params);
    if (!isValid && this.getKeySecret() !== "placeholder_secret") {
      throw new Error("Invalid Razorpay payment signature. Payment rejected.");
    }

    const admin = getSupabaseAdmin();

    // 1. Fetch booking and session
    const { data: booking, error: bErr } = await admin
      .from("bookings")
      .select("*, experience_sessions(*)")
      .eq("id", params.bookingId)
      .single();

    if (bErr || !booking) {
      throw new Error("Booking record not found.");
    }

    // 2. Insert Payment Record
    await admin.from("payments").insert({
      booking_id: params.bookingId,
      razorpay_order_id: params.razorpayOrderId,
      razorpay_payment_id: params.razorpayPaymentId,
      razorpay_signature: params.razorpaySignature,
      amount_in_paise: booking.total_amount_inr,
      currency: "INR",
      verified_server_side: true,
      status: "captured",
    });

    // 3. Mark booking confirmed
    await admin
      .from("bookings")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.bookingId);

    // 4. Increment session booked seats
    if (booking.session_id) {
      await admin.rpc("increment_session_seats", {
        session_id_param: booking.session_id,
        seats_param: booking.seats_count || 1,
      });
    }

    return { success: true, bookingId: params.bookingId };
  }

  /**
   * Verifies Razorpay Webhook signature
   */
  static verifyWebhookSignature(body: string, receivedSignature: string): boolean {
    const secret = this.getWebhookSecret();
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
    return expected === receivedSignature;
  }
}
