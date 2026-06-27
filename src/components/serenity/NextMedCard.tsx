import { Pill, Check, Clock, X } from "lucide-react";
import { useSerenity } from "./SerenityContext";

export function NextMedCard() {
  const { meds, setMedStatus } = useSerenity();
  const next = meds.find((m) => m.status === "upcoming" || m.status === "snoozed");

  if (!next) {
    return (
      <section className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Pill className="h-6 w-6 text-mint" aria-hidden /> Next medication
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          All caught up for today. Wonderful work.
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Pill className="h-6 w-6 text-mint" aria-hidden /> Next medication
      </h2>
      <div className="mt-4 rounded-2xl bg-mint/30 p-5">
        <p className="text-2xl font-bold text-foreground">{next.name}</p>
        <p className="mt-1 text-lg text-foreground/80">
          {next.dose} • <span className="font-semibold">{next.time}</span>
        </p>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={() => setMedStatus(next.id, "taken")}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-lg font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Check className="h-5 w-5" aria-hidden /> Took it
        </button>
        <button
          onClick={() => setMedStatus(next.id, "snoozed")}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sky px-4 py-3 text-lg font-semibold text-foreground shadow-sm transition-colors hover:bg-sky/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Clock className="h-5 w-5" aria-hidden /> Snooze
        </button>
        <button
          onClick={() => setMedStatus(next.id, "missed")}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blush px-4 py-3 text-lg font-semibold text-foreground shadow-sm transition-colors hover:bg-blush/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-5 w-5" aria-hidden /> Skip
        </button>
      </div>
    </section>
  );
}