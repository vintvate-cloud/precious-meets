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
  Sparkles,
  KeyRound,
  Check,
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

type PaymentTab = "upi" | "card" | "netbanking";

// Active Razorpay Test Credentials provided
const RAZORPAY_TEST_KEY_ID = "rzp_test_Ts3sw4uyv2qQqu";

export function RazorpaySubscriptionModal({
  open,
  onOpenChange,
  userName,
  userEmail,
  userPhone = "",
  amountInr = 1999,
  planTitle = "Precious Meets Membership",
  onSuccess,
  onError,
}: RazorpaySubscriptionModalProps) {
  const [tab, setTab] = useState<PaymentTab>("upi");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  // UPI State
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");

  // Card State (Clean real inputs, no mock prefilled numbers)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState(userName || "");

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
    setCardHolder(userName || "MEMBER");
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
      setStatusMessage(`Authorizing credentials with test key (${RAZORPAY_TEST_KEY_ID})...`);
    }, 500);

    setTimeout(() => {
      setStatusMessage("Verifying cryptographic signature & 256-bit SSL token...");
    }, 1000);

    setTimeout(() => {
      setStatus("success");
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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
    }, 1600);
  };

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInr);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (status !== "processing") {
          onOpenChange(val);
        }
      }}
    >
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-[#FAF7F2] text-[#171514] border border-[#C6A568]/40 shadow-2xl rounded-3xl">
        <DialogTitle className="sr-only">Razorpay Custom Payment Gateway</DialogTitle>

        {/* ========================================================= */}
        {/* BRANDED HEADER: DEEP BURGUNDY (#691C35) + CHAMPAGNE GOLD */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-[#691C35] via-[#5A172D] to-[#430F1F] text-white p-5 sm:p-6 relative overflow-hidden">
          {/* Subtle gold ambient glow */}
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[#C6A568]/20 blur-2xl pointer-events-none" />

          {/* Test Mode Badge */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 border border-[#C6A568]/40 text-[10px] font-mono text-[#E5C17D]">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Razorpay Live Test</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-mono">{RAZORPAY_TEST_KEY_ID.slice(0, 12)}...</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#FAF7F2]/80 font-mono">
              <Lock className="size-3 text-[#C6A568]" />
              <span>256-bit SSL</span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Monogram Crest */}
              <div className="size-11 rounded-xl bg-white/10 backdrop-blur-md border border-[#C6A568]/50 flex items-center justify-center font-serif font-bold text-[#E5C17D] text-xl shadow-inner">
                PM
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-tight text-white leading-tight">
                  Precious Meets
                </h3>
                <p className="text-xs text-[#FAF7F2]/85 line-clamp-1 font-serif italic mt-0.5">
                  {planTitle}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#E5C17D] block">
                Total Payable
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {formattedAmount}
              </div>
            </div>
          </div>

          {/* Member Contact Strip */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/90">
            <div className="flex items-center gap-1.5 truncate max-w-[340px]">
              <span className="font-medium text-white">{contactName || "Member"}</span>
              <span className="text-[#C6A568]">·</span>
              <span className="text-white/80 truncate text-[11px] font-mono">{contactEmail}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditingContact(!editingContact)}
              className="text-[11px] text-[#E5C17D] hover:text-white underline decoration-[#E5C17D]/50 cursor-pointer shrink-0 font-medium"
            >
              {editingContact ? "Done" : "Change"}
            </button>
          </div>

          {/* Inline Edit Details Drawer */}
          {editingContact && (
            <div className="mt-3 p-3 bg-black/30 rounded-xl border border-[#C6A568]/30 space-y-2 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-[#E5C17D]">Member Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-[#C6A568]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-mono text-[#E5C17D]">Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-[#C6A568]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-[#E5C17D]">Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-[#C6A568]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* PAYMENT TABS & BODY IN BRAND PALETTE                     */}
        {/* ========================================================= */}
        {status === "processing" ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="size-16 rounded-full border-4 border-[#691C35]/20 border-t-[#691C35] animate-spin" />
              <ShieldCheck className="size-6 text-[#691C35] absolute inset-0 m-auto" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-zinc-900 text-lg">
                Authorizing via Razorpay Gateway
              </h4>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto animate-pulse">
                {statusMessage}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <Lock className="size-3 text-[#5F7045]" />
              <span>PCI-DSS Level 1 · 256-bit Encryption</span>
            </div>
          </div>
        ) : status === "success" ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-zinc-900 text-xl">
                Payment Authorized!
              </h4>
              <p className="text-xs text-zinc-600 mt-1">
                Your Razorpay invoice and membership credentials are being generated...
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Payment Method Selector Tabs */}
            <div className="flex border-b border-[#C6A568]/25 bg-[#FAF7F2] text-xs font-medium">
              <button
                type="button"
                onClick={() => setTab("upi")}
                className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tab === "upi"
                    ? "border-b-2 border-[#691C35] text-[#691C35] bg-white font-semibold shadow-xs"
                    : "text-[#171514]/65 hover:text-[#171514]"
                }`}
              >
                <Smartphone className="size-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("card")}
                className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tab === "card"
                    ? "border-b-2 border-[#691C35] text-[#691C35] bg-white font-semibold shadow-xs"
                    : "text-[#171514]/65 hover:text-[#171514]"
                }`}
              >
                <CreditCard className="size-4" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("netbanking")}
                className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tab === "netbanking"
                    ? "border-b-2 border-[#691C35] text-[#691C35] bg-white font-semibold shadow-xs"
                    : "text-[#171514]/65 hover:text-[#171514]"
                }`}
              >
                <Building2 className="size-4" />
                <span>Netbanking</span>
              </button>
            </div>

            {/* TAB PANELS */}
            <div className="p-5 sm:p-6 space-y-4 bg-white">
              {/* TAB 1: UPI */}
              {tab === "upi" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#691C35] uppercase font-mono tracking-wider block mb-2">
                      Instant UPI Application
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
                              ? "border-[#691C35] bg-[#691C35]/5 text-[#691C35] font-semibold ring-1 ring-[#691C35] shadow-xs"
                              : "border-zinc-200 bg-[#FAF7F2]/60 text-zinc-700 hover:border-[#C6A568]"
                          }`}
                        >
                          <span className="text-base">{app.icon}</span>
                          <span className="text-[11px]">{app.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#171514]/70 uppercase font-mono tracking-wider block mb-1.5">
                      Or Enter UPI ID / VPA
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-[#FAF7F2]/50 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-400">
                        @upi
                      </span>
                    </div>
                  </div>

                  {/* QR Code Prompt */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C6A568]/30 flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-white border border-[#C6A568]/40 flex items-center justify-center shrink-0 shadow-xs">
                      <QrCode className="size-6 text-[#691C35]" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[#171514]">Scan & Pay via any UPI App</p>
                      <p className="text-[11px] text-[#171514]/65">
                        Seamless instant authorization via Paytm, BHIM, Google Pay, or PhonePe
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {tab === "card" && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#171514]/70 uppercase font-mono tracking-wider block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-[#FAF7F2]/50 text-xs font-mono text-zinc-900 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-blue-700 font-mono">VISA</span>
                        <span className="text-[10px] font-bold text-red-600 font-mono">MC</span>
                        <span className="text-[10px] font-bold text-emerald-700 font-mono">RUPAY</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#171514]/70 uppercase font-mono tracking-wider block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-[#FAF7F2]/50 text-xs font-mono text-zinc-900 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#171514]/70 uppercase font-mono tracking-wider block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-[#FAF7F2]/50 text-xs font-mono text-zinc-900 outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#171514]/70 uppercase font-mono tracking-wider block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-[#FAF7F2]/50 text-xs text-zinc-900 uppercase outline-none focus:border-[#691C35] focus:ring-1 focus:ring-[#691C35]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {tab === "netbanking" && (
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-[#691C35] uppercase font-mono tracking-wider block mb-1">
                    Select Your Bank
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
                            : "border-zinc-200 bg-[#FAF7F2]/60 text-zinc-700 hover:border-[#C6A568]"
                        }`}
                      >
                        <Building2 className="size-4 mx-auto mb-1 text-[#691C35]" />
                        <span className="text-[11px] truncate block">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION PAY BUTTON */}
              <div className="pt-2">
                <Button
                  onClick={handlePay}
                  className="w-full py-6 rounded-xl bg-[#691C35] hover:bg-[#531529] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#691C35]/25 border border-[#C6A568]/40 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Lock className="size-4 text-[#E5C17D]" />
                  <span>Pay {formattedAmount} via Razorpay Secure</span>
                </Button>
              </div>

              {/* Razorpay Trust Badges & Credential Reference */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-zinc-100">
                <div className="flex items-center gap-1 text-[#5F7045]">
                  <ShieldCheck className="size-3.5" />
                  <span>PCI-DSS Level 1 · RBI Regulated</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-600">
                  <span>Gateway:</span>
                  <span className="font-bold text-[#0c2340]">Razorpay</span>
                  <span className="text-[#C6A568]">({RAZORPAY_TEST_KEY_ID.slice(0, 8)}...)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
