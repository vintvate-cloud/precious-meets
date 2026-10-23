import { useState, useEffect } from "react";
import { AdminEvent } from "@/lib/events-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, Calendar, Clock, DollarSign, Image, User, ShieldCheck } from "lucide-react";

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  initialEvent?: AdminEvent | null;
  onSave: (eventData: Omit<AdminEvent, "id" | "seats">) => void;
}

const PRESET_COVERS = [
  {
    label: "Candlelit Supper",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Artisan Coffee",
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Twilight Wine & Tapas",
    url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Heritage Garden Salon",
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  },
];

export function EventFormModal({
  open,
  onClose,
  initialEvent,
  onSave,
}: EventFormModalProps) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState<"Delhi NCR">("Delhi NCR");
  const [neighborhood, setNeighborhood] = useState("Mehrauli");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [secretAccessCode, setSecretAccessCode] = useState("");
  const [dateDisplay, setDateDisplay] = useState("This Thursday · 8:00 PM");
  const [priceInr, setPriceInr] = useState(2499);
  const [category, setCategory] = useState<AdminEvent["category"]>("supper_club");
  const [hostName, setHostName] = useState("Chef Tara Sen");
  const [hostRole, setHostRole] = useState("Culinary Anthropologist");
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState<AdminEvent["status"]>("published");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setCity(initialEvent.city);
      setNeighborhood(initialEvent.neighborhood);
      setVenueName(initialEvent.venueName);
      setVenueAddress(initialEvent.venueAddress);
      setSecretAccessCode(initialEvent.secretAccessCode);
      setDateDisplay(initialEvent.dateDisplay);
      setPriceInr(initialEvent.priceInr);
      setCategory(initialEvent.category);
      setHostName(initialEvent.hostName);
      setHostRole(initialEvent.hostRole);
      setCoverImage(initialEvent.coverImage);
      setTheme(initialEvent.theme);
      setStatus(initialEvent.status);
      setNotes(initialEvent.notes || "");
    } else {
      setTitle("");
      setCity("Delhi NCR");
      setNeighborhood("Mehrauli");
      setVenueName("");
      setVenueAddress("");
      setSecretAccessCode(`PM-${Math.floor(100 + Math.random() * 900)}`);
      setDateDisplay("Thursday · 8:00 PM");
      setPriceInr(2499);
      setCategory("supper_club");
      setHostName("Chef Tara Sen");
      setHostRole("Culinary Anthropologist");
      setCoverImage(PRESET_COVERS[0].url);
      setTheme("Four seasonal courses, candlelight & natural wine");
      setStatus("published");
      setNotes("");
    }
  }, [initialEvent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug =
      initialEvent?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        "-" +
        city.toLowerCase().replace(/\s+/g, "-");

    const startsAt = initialEvent?.startsAt || new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString();
    const endsAt = initialEvent?.endsAt || new Date(Date.now() + 4 * 24 * 3600 * 1000 + 3.5 * 3600 * 1000).toISOString();

    onSave({
      slug,
      title: title.trim(),
      city,
      neighborhood: neighborhood.trim(),
      venueName: venueName.trim(),
      venueAddress: venueAddress.trim(),
      secretAccessCode: secretAccessCode.trim(),
      startsAt,
      endsAt,
      dateDisplay: dateDisplay.trim(),
      priceInr: Number(priceInr),
      category,
      hostName: hostName.trim(),
      hostRole: hostRole.trim(),
      coverImage: coverImage.trim(),
      theme: theme.trim(),
      menuPreview: initialEvent?.menuPreview || [
        "Amuse: Smoked seasonal tartlets",
        "Course 1: Heirloom produce pairing",
        "Main: Slow-cooked signature entrée",
        "Dessert: Artisanal pastry pairing",
      ],
      dietaryOptions: ["Vegetarian", "Non-Vegetarian", "Jain Options Available"],
      status,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl bg-card text-foreground border border-border/80 shadow-2xl p-0 overflow-hidden sm:rounded-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="bg-sage/20 border-b border-border/70 p-6 shrink-0">
          <DialogTitle className="font-display text-2xl">
            {initialEvent ? "Edit Meet Details" : "Host a New Curated Meet"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Configure secret venue coordinates, dining themes, and table logistics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-foreground">Meet Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Long Table Autumn Supper"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Format</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="supper_club">Supper Club</option>
                <option value="coffee_tasting">Slow Coffee Tasting</option>
                <option value="after_dark">After-Dark Walk</option>
                <option value="salon">Cultural Salon</option>
              </select>
            </div>
          </div>

          {/* City & Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Neighborhood</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Mehrauli / Sunder Nursery / Indiranagar"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>
          </div>

          {/* Venue & Secret Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-foreground">Venue Name & Address</label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. The Banyan Courtyard at Mehrauli"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
              <input
                type="text"
                required
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="Full address (dispatched only to verified guests)"
                className="mt-1.5 w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Secret Gate PIN</label>
              <input
                type="text"
                required
                value={secretAccessCode}
                onChange={(e) => setSecretAccessCode(e.target.value)}
                placeholder="e.g. COURTYARD-902"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                Embedded in attendee passes.
              </p>
            </div>
          </div>

          {/* Date, Price & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-foreground">Date Display</label>
              <input
                type="text"
                required
                value={dateDisplay}
                onChange={(e) => setDateDisplay(e.target.value)}
                placeholder="e.g. This Thursday · 8:00 PM"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Seat Price (₹ INR)</label>
              <input
                type="number"
                required
                value={priceInr}
                onChange={(e) => setPriceInr(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Status Lifecycle</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="published">Published (Upcoming)</option>
                <option value="draft">Draft (Curator only)</option>
                <option value="completed">Completed (Past Meet)</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Host Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground">Table Host</label>
              <input
                type="text"
                required
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. Chef Tara Sen"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Host Role</label>
              <input
                type="text"
                required
                value={hostRole}
                onChange={(e) => setHostRole(e.target.value)}
                placeholder="e.g. Culinary Anthropologist & Salon Host"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>
          </div>

          {/* Theme & Menu Preview */}
          <div>
            <label className="font-semibold text-foreground">Theme & Narrative</label>
            <textarea
              rows={2}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Four seasonal courses, candlelight & natural wine in a hidden courtyard."
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
            />
          </div>

          {/* Cover Image & Presets */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground">Cover Image URL</label>
              <div className="flex items-center gap-1.5">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className="rounded-full bg-sage/30 hover:bg-sage px-2 py-0.5 text-[10px] text-foreground transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="url"
              required
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
            />
          </div>

          {/* Curator Notes */}
          <div>
            <label className="font-semibold text-foreground">Internal Curator Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Private guardian stationed at the garden entrance."
              className="mt-1 w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-burgundy px-6 py-2 text-xs font-semibold text-ivory hover:bg-burgundy/90 transition-colors shadow-sm"
            >
              {initialEvent ? "Save Changes" : "Create Meet"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
