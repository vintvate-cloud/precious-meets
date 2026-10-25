// Client-side Razorpay loader & payment handler
export interface RazorpaySubscriptionOptions {
  name: string;
  email: string;
  phone?: string;
  amountInr: number; // e.g. 1999
  archetypeTitle?: string;
  onSuccess: (result: {
    paymentId: string;
    orderId: string;
    signature: string;
    memberId: string;
  }) => void;
  onError: (error: string) => void;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpaySubscriptionCheckout(options: RazorpaySubscriptionOptions) {
  const isLoaded = await loadRazorpayScript();
  const keyId =
    (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_Ts3sw4uyv2qQqu";
  
  const memberId = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // If Razorpay script loaded and key is valid
  if (isLoaded && (window as any).Razorpay && keyId) {
    try {
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount: options.amountInr * 100, // in paise: 199900 = INR 1,999
        currency: "INR",
        name: "Precious Meets",
        description: "Precious Meets Membership Subscription",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=128&q=80",
        prefill: {
          name: options.name,
          email: options.email,
          contact: options.phone || "",
        },
        notes: {
          membership_tier: "Member",
          archetype: options.archetypeTitle || "Curious Flâneur",
          member_id: memberId,
        },
        theme: {
          color: "#691C35", // Deep Burgundy
        },
        handler: function (response: any) {
          options.onSuccess({
            paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
            orderId: response.razorpay_order_id || orderId,
            signature: response.razorpay_signature || `sig_${Date.now()}`,
            memberId,
          });
        },
        modal: {
          ondismiss: function () {
            options.onError("Payment cancelled. You can retry whenever you are ready.");
          },
        },
      });

      rzp.on("payment.failed", function (response: any) {
        options.onError(response.error?.description || "Payment failed at gateway.");
      });

      rzp.open();
      return;
    } catch (e: any) {
      console.error("Razorpay checkout initialization failed:", e);
      options.onError(e.message || "Failed to launch Razorpay gateway.");
      return;
    }
  }

  options.onError("Razorpay payment gateway script could not be loaded. Please check your internet connection.");
}
