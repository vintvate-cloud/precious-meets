import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Precious Meets" },
      { name: "description", content: "Terms of service, table etiquette, and cancellation policy." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-24 pt-28">
        <span className="label-mono text-xs text-forest">Legal Agreement</span>
        <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">
          Terms of <em className="italic text-burgundy">Service</em>
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: October 16, 2026</p>

        <div className="mt-8 space-y-8 text-xs leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing Precious Meets or booking a seat at any curated experience, you agree to comply with these Terms of Service and our Community Table Agreements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">2. Cancellation & Refunds</h2>
            <p className="mt-2">
              We respect your schedule and financial flexibility:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>More than 48 hours before meet:</strong> 100% full refund returned to your original payment method via Razorpay.</li>
              <li><strong>Within 48 hours of meet:</strong> Non-refundable due to reserved culinary preparation, seating allocations, and food wastage mitigation.</li>
              <li><strong>Host or Venue Cancellation:</strong> Immediate 100% automatic refund or priority transfer to the next available date.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">3. Conduct at the Table</h2>
            <p className="mt-2">
              Attendees agree to treat fellow guests, venue staff, and table hosts with utmost courtesy. Disruptive, non-consensual, or discriminatory behaviour will result in immediate expulsion and permanent platform debarment.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">4. Emergency SOS Disclaimer</h2>
            <p className="mt-2">
              The in-app SOS feature is an auxiliary safety notification protocol to escalate alerts to our safety team. In life-threatening emergencies, attendees must directly contact emergency authorities (112) without delay.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
