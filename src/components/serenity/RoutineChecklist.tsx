import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { useSerenity } from "./SerenityContext";

export function RoutineChecklist() {
  const { routine, toggleRoutine } = useSerenity();
  const done = routine.filter((r) => r.done).length;
  const pct = Math.round((done / routine.length) * 100);

  return (
    <section className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <ListChecks className="h-6 w-6 text-periwinkle" aria-hidden /> Today's routine
        </h2>
        <span className="rounded-full bg-periwinkle/30 px-3 py-1 text-base font-semibold text-foreground">
          {done} of {routine.length}
        </span>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-periwinkle transition-all"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {routine.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => toggleRoutine(r.id)}
              aria-pressed={r.done}
              className="flex w-full min-h-14 items-center gap-3 rounded-2xl border border-transparent bg-muted/60 px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {r.done ? (
                <CheckCircle2 className="h-7 w-7 shrink-0 text-primary" aria-hidden />
              ) : (
                <Circle className="h-7 w-7 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span className="flex-1 text-lg font-semibold text-foreground">
                {r.label}
              </span>
              <span className="text-base text-muted-foreground">{r.time}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}