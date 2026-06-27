import { Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "home" | "caregiver";

export function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Switch view"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm"
    >
      <button
        role="tab"
        aria-selected={view === "home"}
        onClick={() => onChange("home")}
        className={cn(
          "flex min-h-12 items-center gap-2 rounded-full px-5 py-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          view === "home" ? "bg-mint text-foreground" : "text-muted-foreground hover:bg-muted",
        )}
      >
        <Heart className="h-5 w-5" aria-hidden /> Home
      </button>
      <button
        role="tab"
        aria-selected={view === "caregiver"}
        onClick={() => onChange("caregiver")}
        className={cn(
          "flex min-h-12 items-center gap-2 rounded-full px-5 py-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          view === "caregiver" ? "bg-periwinkle text-foreground" : "text-muted-foreground hover:bg-muted",
        )}
      >
        <Users className="h-5 w-5" aria-hidden /> Caregiver
      </button>
    </div>
  );
}