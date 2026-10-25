import { useState, useEffect, useRef } from "react";
import { AdminEvent } from "@/lib/events-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  Image as ImageIcon,
  Check,
  Link2,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

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
    label: "Heritage Courtyard Table",
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Botanical Greenhouse",
    url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Rooftop Conservatory",
    url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
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
  const [category, setCategory] = useState<AdminEvent["category"]>("supper_club");
  const [hostName, setHostName] = useState("Chef Tara Sen");
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState<AdminEvent["status"]>("published");

  // Cover Image Modal state
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [tempCoverImage, setTempCoverImage] = useState(PRESET_COVERS[0].url);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setCity(initialEvent.city);
      setNeighborhood(initialEvent.neighborhood);
      setVenueName(initialEvent.venueName);
      setVenueAddress(initialEvent.venueAddress);
      setSecretAccessCode(initialEvent.secretAccessCode);
      setDateDisplay(initialEvent.dateDisplay);
      setCategory(initialEvent.category);
      setHostName(initialEvent.hostName);
      setCoverImage(initialEvent.coverImage);
      setTempCoverImage(initialEvent.coverImage);
      setTheme(initialEvent.theme);
      setStatus(initialEvent.status);
    } else {
      setTitle("");
      setCity("Delhi NCR");
      setNeighborhood("Mehrauli");
      setVenueName("");
      setVenueAddress("");
      setSecretAccessCode(`PM-${Math.floor(100 + Math.random() * 900)}`);
      setDateDisplay("Thursday · 8:00 PM");
      setCategory("supper_club");
      setHostName("Chef Tara Sen");
      setCoverImage(PRESET_COVERS[0].url);
      setTempCoverImage(PRESET_COVERS[0].url);
      setTheme("Four seasonal courses, candlelight & natural wine");
      setStatus("published");
    }
  }, [initialEvent, open]);

  // Handle Drag & Drop of Image file
  const handleDropFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file (JPG, PNG, or WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCoverImage(result);
        setTempCoverImage(result);
        toast.success("Cover image updated successfully!");
        setCoverModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDropFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleDropFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setTempCoverImage(urlInput.trim());
    setCoverImage(urlInput.trim());
    toast.success("Cover image URL applied.");
    setUrlInput("");
    setCoverModalOpen(false);
  };

  const handleConfirmCover = () => {
    setCoverImage(tempCoverImage);
    setCoverModalOpen(false);
    toast.success("Cover image saved.");
  };

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
      priceInr: initialEvent?.priceInr ?? 2499,
      category,
      hostName: hostName.trim(),
      hostRole: initialEvent?.hostRole || "Table Host & Curator",
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
      notes: initialEvent?.notes || "",
    });
    onClose();
  };

  return (
    <>
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
            {/* Title */}
            <div>
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

            {/* City & Neighborhood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy cursor-pointer"
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
                  placeholder="e.g. Mehrauli / Sunder Nursery / Chanakyapuri"
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

            {/* Date Display & Status (Seat Price removed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <label className="font-semibold text-foreground">Status Lifecycle</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy cursor-pointer"
                >
                  <option value="published">Published (Upcoming)</option>
                  <option value="draft">Draft (Curator only)</option>
                  <option value="completed">Completed (Past Meet)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Table Host (Host Role removed) */}
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

            {/* Theme & Narrative */}
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

            {/* Cover Image Preview & Trigger to Open Drag/Drop Modal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-foreground">Meet Cover Image</label>
                <button
                  type="button"
                  onClick={() => {
                    setTempCoverImage(coverImage);
                    setCoverModalOpen(true);
                  }}
                  className="text-xs text-[#691C35] hover:text-[#691C35]/80 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <UploadCloud className="size-3.5" />
                  <span>Upload / Choose Image</span>
                </button>
              </div>

              {/* Interactive Cover Banner Preview & Direct Drag-and-Drop Area */}
              <div
                onClick={() => {
                  setTempCoverImage(coverImage);
                  setCoverModalOpen(true);
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative h-40 w-full rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                  isDragging
                    ? "border-[#691C35] bg-[#691C35]/10 scale-[1.01]"
                    : "border-border/80 hover:border-[#691C35]/50 bg-card shadow-xs"
                }`}
              >
                <img
                  src={coverImage}
                  alt="Meet cover preview"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                      <ImageIcon className="size-3.5" />
                      <span>Click to open cover picker or drop image directly</span>
                    </span>
                    <span className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1 text-[11px] font-semibold border border-white/20 transition-colors">
                      Change Cover
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#691C35] px-6 py-2 text-xs font-semibold text-ivory hover:bg-[#691C35]/90 transition-colors shadow-sm cursor-pointer"
              >
                {initialEvent ? "Save Changes" : "Create Meet"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* COVER IMAGE MODAL (DRAG & DROP, BROWSE, PRESETS & URL)                    */}
      {/* ========================================================================= */}
      <Dialog open={coverModalOpen} onOpenChange={setCoverModalOpen}>
        <DialogContent className="max-w-xl bg-ivory text-foreground border border-border shadow-2xl p-0 overflow-hidden rounded-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="bg-card border-b border-border/70 p-5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-[#691C35]/10 text-[#691C35] flex items-center justify-center">
                <ImageIcon className="size-4" />
              </div>
              <div>
                <DialogTitle className="font-display text-xl text-foreground">
                  Select Meet Cover Image
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Drag and drop your own photo, paste a link, or pick an editorial preset.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-[#691C35] bg-[#691C35]/10 scale-[1.01]"
                  : "border-border/80 hover:border-[#691C35]/60 bg-card hover:bg-[#691C35]/[0.02]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <UploadCloud className="size-8 text-[#691C35] mx-auto mb-2" />
              <p className="font-semibold text-foreground text-sm">
                Drag and drop your image here
              </p>
              <p className="text-muted-foreground text-[11px] mt-1">
                or <span className="text-[#691C35] underline font-medium">browse files</span> from your computer (JPG, PNG, WebP)
              </p>
            </div>

            {/* Preset Covers Gallery */}
            <div>
              <label className="font-semibold text-foreground block mb-2">
                Editorial Atmosphere Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESET_COVERS.map((preset) => {
                  const isSelected = tempCoverImage === preset.url;
                  return (
                    <div
                      key={preset.label}
                      onClick={() => setTempCoverImage(preset.url)}
                      className={`group relative h-20 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-[#691C35] ring-2 ring-[#691C35]/30 shadow-md"
                          : "border-border/80 hover:border-[#691C35]/40 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                        <span className="text-[10px] font-medium text-white truncate drop-shadow-xs">
                          {preset.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-[#691C35] text-white flex items-center justify-center shadow-xs">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Image URL Input */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Or Paste Image Web Link
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-xl border border-input bg-card pl-8 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="rounded-xl text-xs px-3.5 cursor-pointer"
                >
                  Load
                </Button>
              </div>
            </div>

            {/* Preview Box */}
            {tempCoverImage && (
              <div className="pt-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Selected Preview
                </label>
                <div className="h-28 w-full rounded-xl overflow-hidden border border-border shadow-2xs">
                  <img
                    src={tempCoverImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-card border-t border-border/70 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCoverModalOpen(false)}
              className="rounded-full text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmCover}
              className="rounded-full bg-[#691C35] text-ivory hover:bg-[#691C35]/90 text-xs font-semibold px-4 cursor-pointer"
            >
              Set Cover Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
