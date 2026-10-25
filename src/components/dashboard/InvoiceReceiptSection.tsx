import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  CreditCard,
  ShieldCheck,
  Building,
  FileText,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function InvoiceReceiptSection() {
  const { user, profile, subscription } = useAuth();
  const [invoiceDate, setInvoiceDate] = useState("22 October 2026");
  const [paymentId, setPaymentId] = useState("pay_PM_99214482");
  const [memberId, setMemberId] = useState("PM-FOUNDER-8841");

  useEffect(() => {
    if (subscription) {
      if (subscription.subscribedAt) {
        setInvoiceDate(new Date(subscription.subscribedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }));
      }
      if (subscription.paymentId) setPaymentId(subscription.paymentId);
      if (subscription.memberId) setMemberId(subscription.memberId);
    }
  }, [subscription]);

  const handlePrint = () => {
    window.print();
  };

  const displayName = profile?.display_name || user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : "Founding Member");
  const email = user?.email || "";
  const city = profile?.city || "Delhi NCR";
  const phone = profile?.phone || "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border/60 pb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold">
            Tax Invoice & Membership Documentation
          </span>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl text-foreground">
            Payment Invoice & Receipts
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Official receipt documenting your application date, pass tier, and tax payment details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="rounded-full border-border/80 text-xs px-4 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="size-3.5" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Luxury Printable Invoice Sheet */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-lg print:border-none print:shadow-none print:p-0">
        {/* Invoice Top Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start border-b border-border/60 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
                Precious<em className="text-burgundy not-italic font-normal">meets</em>
              </span>
              <span className="rounded-full bg-forest/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-forest uppercase">
                Official Receipt
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Vintvate Cloud Dining Experiences Pvt. Ltd.
            </p>
            <p className="text-[11px] text-muted-foreground">
              GSTIN: 07AABCV1289P1Z4 · Mehrauli Heritage Quarter, New Delhi 110030
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="font-mono text-xs font-bold text-burgundy block">
              INVOICE #{memberId.replace("PM-", "INV-2026-")}
            </span>
            <span className="text-xs text-muted-foreground block">
              Application & Payment Date: <strong className="text-foreground">{invoiceDate}</strong>
            </span>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/30">
              <CheckCircle2 className="size-3.5" /> Payment Status: PAID
            </div>
          </div>
        </div>

        {/* Member Billing Details */}
        <div className="grid gap-6 sm:grid-cols-2 py-6 border-b border-border/60 text-xs">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
              Billed To (Member)
            </span>
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            <p className="text-muted-foreground">{email}</p>
            <p className="text-muted-foreground">{phone}</p>
            <p className="text-muted-foreground">{city} Dining Circle</p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
              Transaction Details
            </span>
            <p className="text-muted-foreground">
              Gateway Reference: <strong className="font-mono text-foreground">{paymentId}</strong>
            </p>
            <p className="text-muted-foreground">
              Payment Method: <span className="font-medium text-foreground">UPI / NetBanking (Auto-Verified)</span>
            </p>
            <p className="text-muted-foreground">
              Pass Validity: <strong className="text-forest">365 Days (Active)</strong>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6 border-b border-border/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 text-center font-semibold">Period</th>
                  <th className="pb-3 text-center font-semibold">Qty</th>
                  <th className="pb-3 text-right font-semibold">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-foreground text-sm">
                      Annual Founding Member Circle Pass
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-md">
                      Exclusive admission to 6-person curated dinner salons, 100% offline Aadhaar identity vetting, table host coordination, seasonal tasting pairings, and safe departure concierge.
                    </p>
                  </td>
                  <td className="py-4 text-center font-mono text-muted-foreground">
                    1 Year
                  </td>
                  <td className="py-4 text-center font-mono">1</td>
                  <td className="py-4 text-right font-mono font-medium">₹1,694.07</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtotal & Taxes */}
          <div className="mt-4 flex flex-col items-end space-y-1.5 text-xs">
            <div className="flex justify-between w-64 text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-mono">₹1,694.07</span>
            </div>
            <div className="flex justify-between w-64 text-muted-foreground">
              <span>CGST (9%):</span>
              <span className="font-mono">₹152.46</span>
            </div>
            <div className="flex justify-between w-64 text-muted-foreground">
              <span>SGST (9%):</span>
              <span className="font-mono">₹152.46</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-border/80 text-sm font-bold text-foreground">
              <span>Total Paid:</span>
              <span className="font-mono text-burgundy text-base">₹1,999.00</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Seal & Terms */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2 text-forest font-medium">
            <ShieldCheck className="size-4 text-forest" />
            <span>Digital Certified Tax Invoice · No Signature Required</span>
          </div>

          <div className="text-right">
            <span>Questions regarding this receipt? </span>
            <a
              href="mailto:concierge@preciousmeets.com"
              className="text-burgundy font-semibold hover:underline"
            >
              concierge@preciousmeets.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
