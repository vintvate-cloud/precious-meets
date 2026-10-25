import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Precious Meets" },
      { name: "description", content: "Privacy policy and DPDP Act compliance notes for Precious Meets." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-24 pt-28">
        <span className="label-mono text-xs text-forest">Privacy & Data Governance</span>
        <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">
          Privacy <em className="italic text-burgundy">Policy</em>
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: October 16, 2026</p>

        <div className="mt-8 space-y-8 text-xs leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl text-foreground">1. Commitment to Privacy</h2>
            <p className="mt-2">
              Precious Meets Technologies Pvt. Ltd. (“we”, “us”, “our”) respects your dignity and data autonomy. We operate under the principles of the Indian Digital Personal Data Protection Act, 2023 (DPDP Act).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">2. Information We Collect</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Profile Information:</strong> Full name, email address, profile avatar provided via Google OAuth.</li>
              <li><strong>Social Discovery Answers:</strong> Preferences regarding social energy, conversation style, dietary restrictions, and allergies.</li>
              <li><strong>Identity Verification:</strong> Cryptographic confirmation and timestamp from authorized DigiLocker offline XML partners. We never store 12-digit Aadhaar numbers or biometrics.</li>
              <li><strong>Transactional Data:</strong> Razorpay order IDs, payment receipts, and amounts in integer paise. No card or UPI PINs are ever collected or stored on our servers.</li>
              <li><strong>Safety & Emergency SOS:</strong> Incident descriptions, optional GPS coordinates collected strictly with real-time explicit consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">3. What We Never Do</h2>
            <p className="mt-2">
              We never sell your data, expose your private quiz responses to other attendees, or disclose your contact details to table guests without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">4. Data Deletion & Grievance Redressal</h2>
            <p className="mt-2">
              You can request complete account deletion at any time by contacting privacy@preciousmeets.com. We remove your personal identifiable records within 30 days, retaining only legally mandated financial audit logs.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
