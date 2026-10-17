import { describe, expect, it } from "vitest";
import { RazorpayService } from "@/lib/razorpay";
import crypto from "crypto";

describe("Razorpay Signature & Payment Validation", () => {
  it("verifies HMAC-SHA256 signature accurately", () => {
    const orderId = "order_9A33X56789";
    const paymentId = "pay_2938475620";
    const secret = "placeholder_secret";

    const signature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const isValid = RazorpayService.verifySignature({
      bookingId: "bk_123",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    });

    expect(isValid).toBe(true);
  });

  it("rejects forged or tampered signatures", () => {
    const isValid = RazorpayService.verifySignature({
      bookingId: "bk_123",
      razorpayOrderId: "order_9A33X56789",
      razorpayPaymentId: "pay_2938475620",
      razorpaySignature: "forged_malicious_signature_hash",
    });

    expect(isValid).toBe(false);
  });
});
