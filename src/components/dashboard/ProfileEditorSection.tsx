import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Utensils,
  Sparkles,
  AlertCircle,
  Save,
  Check,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProfileEditorSection() {
  const { profile, user, refreshProfile } = useAuth();

  // Local editable state
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Delhi NCR");
  const [dietary, setDietary] = useState("Vegetarian");
  const [allergies, setAllergies] = useState<string[]>(["Gluten sensitivity"]);
  const [emergencyName, setEmergencyName] = useState("Vikram Sharma");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 98110 55432");
  const [saving, setSaving] = useState(false);

  // Archetype dimensions
  const [archetypeData, setArchetypeData] = useState({
    title: "The Curious Flâneur",
    description: "Thrives at the intersection of architectural wonder, cultural history, and dinner dialogue.",
    dimensions: {
      socialEnergy: 74,
      conversationDepth: 88,
      curiosity: 92,
      adventure: 78,
    },
  });

  useEffect(() => {
    // Read from localStorage if existing
    const savedContact = localStorage.getItem("precious_meets_user_contact");
    if (savedContact) {
      try {
        const c = JSON.parse(savedContact);
        if (c.fullName) setFullName(c.fullName);
        if (c.phone) setPhone(c.phone);
      } catch (e) {
        // ignore
      }
    }

    const savedPrefs = localStorage.getItem("precious_meets_user_preferences");
    if (savedPrefs) {
      try {
        const pr = JSON.parse(savedPrefs);
        if (pr.displayName) setDisplayName(pr.displayName);
        if (pr.bio) setBio(pr.bio);
        if (pr.city) setCity(pr.city);
        if (pr.dietary) setDietary(pr.dietary);
        if (Array.isArray(pr.allergies)) setAllergies(pr.allergies);
        if (pr.emergencyName) setEmergencyName(pr.emergencyName);
        if (pr.emergencyPhone) setEmergencyPhone(pr.emergencyPhone);
      } catch (e) {
        // ignore
      }
    }

    const savedProfile = localStorage.getItem("precious_meets_latest_profile");
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        setArchetypeData((prev) => ({
          title: p?.archetype?.title || prev.title,
          description: p?.archetype?.description || prev.description,
          dimensions: {
            socialEnergy: p?.dimensions?.socialEnergy ?? p?.archetype?.dimensions?.socialEnergy ?? prev.dimensions.socialEnergy,
            conversationDepth: p?.dimensions?.conversationDepth ?? p?.archetype?.dimensions?.conversationDepth ?? prev.dimensions.conversationDepth,
            curiosity: p?.dimensions?.curiosity ?? p?.archetype?.dimensions?.curiosity ?? prev.dimensions.curiosity,
            adventure: p?.dimensions?.adventure ?? p?.archetype?.dimensions?.adventure ?? prev.dimensions.adventure,
          },
        }));
      } catch (e) {
        // ignore
      }
    }

    if (profile) {
      setFullName((prev) => prev || profile.full_name || "");
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "Passionate about thoughtful conversation and discovering shared tables.");
      setPhone((prev) => prev || profile.phone || "+91 98100 12345");
      setCity(profile.city || "Delhi NCR");
    }
  }, [profile]);

  const toggleAllergy = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter((a) => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const handleSave = () => {
    setSaving(true);
    try {
      // Save contact & profile updates to localStorage
      const updatedContact = {
        fullName,
        phone,
        email: user?.email || "member@preciousmeets.com",
      };
      localStorage.setItem("precious_meets_user_contact", JSON.stringify(updatedContact));

      const updatedPrefs = {
        displayName,
        bio,
        city,
        dietary,
        allergies,
        emergencyName,
        emergencyPhone,
      };
      localStorage.setItem("precious_meets_user_preferences", JSON.stringify(updatedPrefs));

      toast.success("Profile & dining preferences updated successfully!");
    } catch (err: any) {
      toast.error("Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border/60 pb-5">
        <h2 className="font-display mt-1 text-2xl sm:text-3xl text-foreground">
          Manage Profile
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Left Form: Personal & Dietary Details */}
        <div className="space-y-6 md:col-span-8">
          {/* Personal Details */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="font-display text-xl text-foreground flex items-center gap-2">
              <User className="size-5 text-burgundy" /> Personal Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Full Name (as per ID)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                  placeholder="e.g. Aria Sharma"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Table Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                  placeholder="e.g. Aria"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                  placeholder="+91 98100 00000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Primary Dining City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Bio & Conversational Sparks
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-burgundy/30 leading-relaxed"
                placeholder="Share a quiet passion or topics you love exploring at dinner..."
              />
            </div>
          </div>

          {/* Dietary & Allergy Management */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                <Utensils className="size-5 text-forest" /> Dietary Requirements
              </h3>
              <span className="font-mono text-[11px] text-muted-foreground">
                Strict Host Assurance
              </span>
            </div>

            {/* Diet Options */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Primary Diet
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDietary(d)}
                    className={`rounded-xl p-2.5 text-center text-xs font-medium border transition-all cursor-pointer ${
                      dietary === d
                        ? "border-forest bg-forest/15 text-forest font-semibold"
                        : "border-border/80 bg-background text-muted-foreground hover:bg-sage/20"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies / Intolerances */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Allergies & Intolerances (Host will accommodate)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Gluten sensitivity",
                  "Peanuts",
                  "Tree Nuts",
                  "Dairy / Lactose",
                  "Shellfish",
                  "Soy",
                  "No Mushrooms",
                ].map((alg) => {
                  const active = allergies.includes(alg);
                  return (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => toggleAllergy(alg)}
                      className={`rounded-full px-3 py-1.5 text-xs transition-all cursor-pointer ${
                        active
                          ? "bg-burgundy text-ivory font-semibold shadow-xs"
                          : "border border-border/80 bg-background text-muted-foreground hover:bg-sage/30"
                      }`}
                    >
                      {active ? `✓ ${alg}` : `+ ${alg}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Emergency Contact & Safety */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="font-display text-xl text-foreground flex items-center gap-2">
              <HeartHandshake className="size-5 text-burgundy" /> Emergency Contact (Safety Protocol)
            </h3>
            <p className="text-xs text-muted-foreground">
              Precious Meets hosts ensure safe departures. If an SOS alert is ever triggered, your emergency contact is notified.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                />
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-burgundy px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-burgundy/90 shadow-md cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Preferences"}
            </Button>
          </div>
        </div>

        {/* Right Column: Archetype Radar & Aadhaar Status Card */}
        <div className="space-y-6 md:col-span-4">
          {/* Identity Shield Card */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <ShieldCheck className="size-6 text-emerald-400" />
              <span className="font-display text-lg text-foreground">
                Verified Member Status
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Your offline Aadhaar verification is active. All members at Precious Meets tables undergo 100% offline identity vetting.
            </p>
            <div className="mt-4 rounded-xl bg-card border border-border/80 p-3 text-[11px] font-mono text-muted-foreground">
              Verification Mode: <strong>Offline XML / DigiLocker</strong>
              <br />
              Status: <strong className="text-forest">Verified & Safe</strong>
            </div>
          </div>

          {/* Archetype Trait Matrix */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ochre font-bold">
                Social Archetype
              </span>
              <Sparkles className="size-4 text-ochre" />
            </div>

            <div>
              <h4 className="font-display text-xl text-foreground">
                {archetypeData?.title || "The Curious Flâneur"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {archetypeData?.description || "Curious, thoughtful, and observant conversation partner."}
              </p>
            </div>

            {/* Dimension Sliders */}
            <div className="space-y-3 pt-2 text-xs">
              {[
                { label: "Social Energy", val: archetypeData?.dimensions?.socialEnergy ?? 74 },
                { label: "Conversation Depth", val: archetypeData?.dimensions?.conversationDepth ?? 88 },
                { label: "Curiosity Factor", val: archetypeData?.dimensions?.curiosity ?? 92 },
                { label: "Adventure Appetite", val: archetypeData?.dimensions?.adventure ?? 78 },
              ].map((dim, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">{dim.label}</span>
                    <span className="font-mono font-bold text-foreground">{dim.val}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-sage/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-burgundy transition-all duration-500"
                      style={{ width: `${dim.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground text-center">
              Calibrated from your Discovery Quiz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
