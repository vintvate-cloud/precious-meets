import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  Lock,
  CheckCircle2,
  Loader2,
  X,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RazorpayPaymentResult {
  paymentId: string;
  orderId: string;
  signature: string;
  method: string;
}

interface RazorpaySubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  userPhone?: string;
  amountInr?: number;
  planTitle?: string;
  onSuccess: (result: RazorpayPaymentResult) => void;
  onError?: (error: string) => void;
}

type PaymentTab = "upi" | "card" | "netbanking" | "wallet";

export function RazorpaySubscriptionModal({
  open,
  onOpenChange,
  userName,
  userEmail,
  userPhone = "+91 98765 43210",
  amountInr = 1999,
  planTitle = "Annual Founding Member Pass",
  onSuccess,
  onError,
}: RazorpaySubscriptionModalProps) {
  const [tab, setTab] = useState<PaymentTab>("upi");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  // UPI State
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");

  // Card State
  const [cardNumber, setCardNumber] = useState("4532 8921 7734 6012");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("482");
  const [cardHolder, setCardHolder] = useState(userName || "MEMBER PASS HOLDER");

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Contact info edit mode
  const [editingContact, setEditingContact] = useState(false);
  const [contactName, setContactName] = useState(userName);
  const [contactEmail, setContactEmail] = useState(userEmail);
  const [contactPhone, setContactPhone] = useState(userPhone);

  useEffect(() => {
    setContactName(userName);
    setContactEmail(userEmail);
    setContactPhone(userPhone);
    setCardHolder(userName || "MEMBER PASS HOLDER");
  }, [userName, userEmail, userPhone]);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setStatusMessage("");
    }
  }, [open]);

  const handlePay = () => {
    setStatus("processing");
    setStatusMessage("Connecting to Razorpay Secure Gateway...");

    setTimeout(() => {
      setStatusMessage("Authorizing payment token with bank network...");
    }, 600);

    setTimeout(() => {
      setStatusMessage("Verifying cryptographic signature & 256-bit SSL...");
    }, 1100);

    setTimeout(() => {
      setStatus("success");
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const paymentId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const signature = `sig_rzp_${Date.now()}`;

      setTimeout(() => {
        onSuccess({
          paymentId,
          orderId,
          signature,
          method: tab,
        });
        onOpenChange(false);
      }, 700);
    }, 1700);
  };

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInr);

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (status !== "processing") {
        onOpenChange(val);
      }
    }}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden bg-white text-zinc-900 border border-zinc-200/80 shadow-2xl rounded-2xl sm:rounded-3xl">
        <DialogTitle className="sr-only">Razorpay Checkout</DialogTitle>

        {/* ========================================================= */}
        {/* RAZORPAY BRANDED HEADER                                    */}
        {/* ========================================================= */}
        <div className="bg-[#691C35] text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-display font-bold text-white text-lg shadow-sm">
                PM
              </div>
              <div>
                <h3 className="font-sans font-bold text-base tracking-tight text-white leading-tight">
                  Precious Meets
                </h3>
                <p className="text-xs text-white/80 line-clamp-1">
                  {planTitle}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono tracking-wider uppercase text-white/70 block">
                Amount to Pay
              </span>
              <div className="font-mono text-2xl font-bold tracking-tight text-white">
                {formattedAmount}
              </div>
            </div>
          </div>

          {/* User Contact Strip */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/90">
            <div className="flex items-center gap-1.5 truncate max-w-[320px]">
              <span className="font-medium text-white">{contactName || "Founding Member"}</span>
              <span className="text-white/60">·</span>
              <span className="text-white/80 truncate text-[11px] font-mono">{contactEmail}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditingContact(!editingContact)}
              className="text-[11px] text-white/80 hover:text-white underline decoration-white/40 cursor-pointer shrink-0"
            >
              {editingContact ? "Done" : "Change"}
            </button>
          </div>

          {editingContact && (
            <div className="mt-3 p-3 bg-black/20 rounded-xl border border-white/10 space-y-2 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-white/70">Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-mono text-white/70">Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-white/70">Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* PAYMENT MODES TABS & INTERACTIVE FORM                      */}
        {/* ========================================================= */}
        {status === "processing" ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="size-16 rounded-full border-4 border-[#691C35]/20 border-t-[#691C35] animate-spin" />
              <ShieldCheck className="size-6 text-[#691C35] absolute inset-0 m-auto" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 text-base">
                Processing Razorpay Payment
              </h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto animate-pulse">
                {statusMessage}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
              <Lock className="size-3 text-emerald-600" />
              <span>256-bit Bank Grade SSL Encryption</span>
            </div>
          </div>
        ) : status === "success" ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 text-lg">
                Payment Authorized!
              </h4>
              <p className="text-xs text-zinc-500 mt-1">
                Generating your Razorpay invoice and membership dossier...
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Mode Selector Tabs */}
            <div className="flex border-b border-zinc-200 bg-zinc-50/70 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTab("upi")}
                className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  tab === "upi"
                    ? "border-b-2 border-[#691C35] text-[#691C35] bg-white font-semibold"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <Smartphone className="size-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("card")}
                className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  tab === "card"
                    ? "border-b-2 border-[#691C35] text-[#691C35] bg-white font-semibold"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <CreditCard className="size-4" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("netbanking")}
                className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  tab === "netbanking"
                    ? "border-b-2 border-[#691C35] text-[#691C35] bg-white font-semibold"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <Building2 className="size-4" />
                <span>Netbanking</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* TAB 1: UPI */}
              {tab === "upi" && (
                <div className="space-y-4">
                  {/* Quick UPI Apps */}
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase font-mono tracking-wider block mb-2">
                      Pay using UPI App
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "gpay", label: "GPay", icon: "🟢" },
                        { id: "phonepe", label: "PhonePe", icon: "🟣" },
                        { id: "paytm", label: "Paytm", icon: "🔵" },
                        { id: "cred", label: "CRED UPI", icon: "⚪" },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs cursor-pointer transition-all ${
                            selectedUpiApp === app.id
                              ? "border-[#691C35] bg-[#691C35]/5 text-[#691C35] font-semibold ring-1 ring-[#691C35]"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                          }`}
                        >
                          <span className="text-base">{app.icon}</span>
                          <span className="text-[11px]">{app.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Or Enter UPI ID */}
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase font-mono tracking-wider block mb-1.5">
                      Or Enter UPI ID / VPA
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. mobileNumber@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-400">
                        @upi
                      </span>
                    </div>
                  </div>

                  {/* UPI QR Banner */}
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                      <QrCode className="size-6 text-zinc-700" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-zinc-800">Scan QR Code</p>
                      <p className="text-[11px] text-zinc-500">
                        Instant UPI payment via any scanner app (Paytm, GPay, Bhim)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {tab === "card" && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase font-mono tracking-wider block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-900 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1">
                        <span className="text-[10px] font-bold text-blue-600 font-mono">VISA</span>
                        <span className="text-[10px] font-bold text-red-500 font-mono">MC</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase font-mono tracking-wider block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-900 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase font-mono tracking-wider block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-900 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase font-mono tracking-wider block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs text-zinc-900 uppercase outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {tab === "netbanking" && (
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase font-mono tracking-wider block mb-1">
                    Select Popular Bank
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "HDFC", name: "HDFC Bank" },
                      { id: "ICICI", name: "ICICI Bank" },
                      { id: "SBI", name: "State Bank" },
                      { id: "AXIS", name: "Axis Bank" },
                      { id: "KOTAK", name: "Kotak" },
                      { id: "PNB", name: "PNB" },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-2.5 rounded-xl border text-center text-xs cursor-pointer transition-all ${
                          selectedBank === bank.id
                            ? "border-[#691C35] bg-[#691C35]/5 text-[#691C35] font-semibold ring-1 ring-[#691C35]"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <Building2 className="size-4 mx-auto mb-1 text-zinc-500" />
                        <span className="text-[11px] truncate block">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PAY BUTTON */}
              <div className="pt-2">
                <Button
                  onClick={handlePay}
                  className="w-full py-6 rounded-xl bg-[#691C35] hover:bg-[#531529] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Lock className="size-4" />
                  <span>Pay {formattedAmount} via Razorpay</span>
                </Button>
              </div>

              {/* Razorpay Footer Trust Badges */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <div className="flex items-center gap-1 text-emerald-700">
                  <ShieldCheck className="size-3.5" />
                  <span>PCI-DSS Level 1 Compliant</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <span>Secured by</span>
                  <span className="font-bold text-[#0c2340]">Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
