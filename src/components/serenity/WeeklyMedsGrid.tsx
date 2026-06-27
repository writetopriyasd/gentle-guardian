import { CalendarDays } from "lucide-react";
import { useSerenity, type Medication } from "./SerenityContext";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Deterministic sample weekly schedule based on med id + day index.
function statusFor(med: Medication, dayIdx: number, todayIdx: number) {
  if (dayIdx < todayIdx) {
    // mostly taken, occasional miss
    if ((dayIdx + med.id.charCodeAt(1)) % 9 === 0) return "missed" as const;
    return "taken" as const;
  }
  if (dayIdx === todayIdx) return med.status;
  return "upcoming" as const;
}

const COLORS: Record<string, string> = {
  taken: "bg-mint text-foreground",
  missed: "bg-blush text-foreground",
  upcoming: "bg-muted text-muted-foreground",
  snoozed: "bg-sky text-foreground",
  skipped: "bg-blush/60 text-foreground",
};

export function WeeklyMedsGrid() {
  const { meds } = useSerenity();
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0

  return (
    <section className="rounded-3xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <CalendarDays className="h-6 w-6 text-sky" aria-hidden /> This week's medications
        </h2>
        <div className="hidden items-center gap-3 text-sm text-muted-foreground md:flex">
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-mint" /> Taken</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-blush" /> Missed</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-muted" /> Upcoming</span>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="text-left text-base font-semibold text-muted-foreground">Medication</th>
              {DAYS.map((d, i) => (
                <th
                  key={d}
                  className={cn(
                    "rounded-xl px-2 py-2 text-center text-base font-semibold",
                    i === todayIdx ? "bg-periwinkle/30 text-foreground" : "text-muted-foreground",
                  )}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meds.map((m) => (
              <tr key={m.id}>
                <td className="py-1 pr-3 text-lg font-semibold text-foreground">
                  {m.name}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">{m.dose}</span>
                </td>
                {DAYS.map((d, i) => {
                  const s = statusFor(m, i, todayIdx);
                  return (
                    <td key={d}>
                      <div
                        className={cn(
                          "flex h-10 items-center justify-center rounded-xl text-sm font-semibold capitalize",
                          COLORS[s],
                        )}
                        title={`${m.name} • ${d}: ${s}`}
                      >
                        {s === "taken" ? "✓" : s === "missed" ? "✕" : s === "upcoming" ? "·" : "•"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}