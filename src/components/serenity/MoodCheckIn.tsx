import { useState } from "react";
import { Heart } from "lucide-react";
import { useSerenity, type MoodEntry } from "./SerenityContext";
import { cn } from "@/lib/utils";

const FACES: { score: MoodEntry["score"]; emoji: string; label: string; color: string }[] = [
  { score: 1, emoji: "😟", label: "Not well", color: "bg-blush" },
  { score: 2, emoji: "🙁", label: "Low", color: "bg-blush/70" },
  { score: 3, emoji: "😐", label: "Okay", color: "bg-cream" },
  { score: 4, emoji: "🙂", label: "Good", color: "bg-mint/70" },
  { score: 5, emoji: "😊", label: "Great", color: "bg-mint" },
];

export function MoodCheckIn() {
  const { logMood, moods } = useSerenity();
  const [picked, setPicked] = useState<MoodEntry["score"] | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!picked) return;
    logMood(picked, note.trim() || undefined);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Heart className="h-6 w-6 text-blush" aria-hidden /> Health check-in
        </h2>
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-mint/20 p-6 text-center">
          <p className="text-5xl" aria-hidden>
            💚
          </p>
          <p className="text-xl font-semibold text-foreground">Thank you for sharing.</p>
          <p className="text-base text-muted-foreground">
            {moods.length} check-{moods.length === 1 ? "in" : "ins"} logged this week.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Heart className="h-6 w-6 text-blush" aria-hidden /> Health check-in
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">How are you feeling today?</p>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {FACES.map((f) => (
          <button
            key={f.score}
            onClick={() => setPicked(f.score)}
            aria-label={f.label}
            aria-pressed={picked === f.score}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl p-2 text-3xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              f.color,
              picked === f.score
                ? "scale-105 ring-2 ring-foreground/40"
                : "opacity-80 hover:opacity-100",
            )}
          >
            <span aria-hidden>{f.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{f.label}</span>
          </button>
        ))}
      </div>
      <label className="mt-4 block text-base font-semibold text-foreground" htmlFor="mood-note">
        Anything you'd like to share? <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <textarea
        id="mood-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className="mt-2 w-full resize-none rounded-2xl border border-border bg-background p-3 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="A little tired but okay…"
      />
      <button
        onClick={submit}
        disabled={!picked}
        className="mt-4 min-h-14 rounded-2xl bg-primary px-4 py-3 text-lg font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        Send check-in
      </button>
    </section>
  );
}