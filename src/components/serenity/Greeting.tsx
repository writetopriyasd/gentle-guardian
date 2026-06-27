import { useSerenity } from "./SerenityContext";
import logo from "@/assets/serenity-logo.png";

export function Greeting() {
  const { userName, lastCheckInAt } = useSerenity();
  const hour = new Date().getHours();
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex items-center gap-4">
        <img src={logo} alt="" width={64} height={64} className="h-16 w-16 shrink-0" />
        <div>
          <p className="text-lg text-muted-foreground">{today}</p>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Good {partOfDay}, {userName}.
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {lastCheckInAt
              ? "Thank you for checking in today. I'm here whenever you need me."
              : "Ready for a gentle check-in whenever you are."}
          </p>
        </div>
      </div>
    </header>
  );
}