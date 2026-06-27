import { AlertTriangle, Activity, Smile, Pill, Bell, Clock } from "lucide-react";
import { useSerenity } from "./SerenityContext";
import { cn } from "@/lib/utils";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60_000))} min ago`;
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export function CaregiverDashboard() {
  const { userName, meds, routine, moods, alerts, lastCheckInAt, ackAlert } = useSerenity();

  const takenToday = meds.filter((m) => m.status === "taken").length;
  const missedToday = meds.filter((m) => m.status === "missed").length;
  const adherence = Math.round((takenToday / meds.length) * 100);
  const routineDone = routine.filter((r) => r.done).length;
  const latestMood = moods[0];
  const openAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground">Caring for {userName}</h2>
        <p className="mt-1 text-lg text-muted-foreground">
          A calm overview of today. Pastel and quiet — like the home itself.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Pill className="h-6 w-6" aria-hidden />}
          label="Med adherence"
          value={`${adherence}%`}
          tone="mint"
          sub={`${takenToday}/${meds.length} taken today`}
        />
        <StatCard
          icon={<Activity className="h-6 w-6" aria-hidden />}
          label="Routine"
          value={`${routineDone}/${routine.length}`}
          tone="periwinkle"
          sub="Daily steps completed"
        />
        <StatCard
          icon={<Smile className="h-6 w-6" aria-hidden />}
          label="Mood"
          value={latestMood ? `${latestMood.score}/5` : "—"}
          tone="blush"
          sub={latestMood ? `Last logged ${timeAgo(latestMood.at)}` : "No check-in yet"}
        />
        <StatCard
          icon={<Clock className="h-6 w-6" aria-hidden />}
          label="Last check-in"
          value={lastCheckInAt ? timeAgo(lastCheckInAt) : "Today"}
          tone="sky"
          sub={lastCheckInAt ? "Margaret responded" : "Awaiting today's reply"}
        />
      </div>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Bell className="h-6 w-6 text-blush" aria-hidden /> Alerts
          {openAlerts.length > 0 && (
            <span className="rounded-full bg-blush px-3 py-0.5 text-sm font-bold text-foreground">
              {openAlerts.length} new
            </span>
          )}
        </h3>
        {alerts.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-mint/30 p-5 text-lg text-foreground">
            All quiet. No alerts at the moment. 💚
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {alerts.map((a) => (
              <li
                key={a.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl p-4",
                  a.acknowledged ? "bg-muted" : "bg-blush/40",
                )}
              >
                <AlertTriangle
                  className={cn("mt-1 h-6 w-6 shrink-0", a.acknowledged ? "text-muted-foreground" : "text-foreground")}
                  aria-hidden
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-foreground">{a.title}</p>
                  <p className="text-base text-muted-foreground">{a.detail}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{timeAgo(a.at)}</p>
                </div>
                {!a.acknowledged && (
                  <button
                    onClick={() => ackAlert(a.id)}
                    className="rounded-xl bg-card px-4 py-2 text-base font-semibold text-foreground shadow-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Acknowledge
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground">Mood trend</h3>
        <div className="mt-4 flex items-end gap-3">
          {moods
            .slice(0, 7)
            .reverse()
            .map((m) => (
              <div key={m.id} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-periwinkle"
                  style={{ height: `${m.score * 22}px` }}
                  aria-label={`Score ${m.score} of 5`}
                />
                <span className="text-sm font-semibold text-muted-foreground">{m.score}</span>
              </div>
            ))}
        </div>
        <p className="mt-3 text-base text-muted-foreground">Last {Math.min(moods.length, 7)} check-ins.</p>
      </section>

      {missedToday > 0 && (
        <p className="rounded-2xl bg-blush/40 p-4 text-base text-foreground">
          {missedToday} medication{missedToday > 1 ? "s" : ""} missed today. Consider a friendly nudge.
        </p>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "mint" | "periwinkle" | "blush" | "sky";
}) {
  const toneClass = {
    mint: "bg-mint/40",
    periwinkle: "bg-periwinkle/40",
    blush: "bg-blush/40",
    sky: "bg-sky/40",
  }[tone];
  return (
    <div className={cn("rounded-3xl p-5 shadow-sm", toneClass)}>
      <div className="flex items-center gap-2 text-foreground/80">
        {icon}
        <span className="text-base font-semibold">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}