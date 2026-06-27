import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { SerenityProvider } from "@/components/serenity/SerenityContext";
import { Greeting } from "@/components/serenity/Greeting";
import { ViewToggle, type View } from "@/components/serenity/ViewToggle";
import { NextMedCard } from "@/components/serenity/NextMedCard";
import { RoutineChecklist } from "@/components/serenity/RoutineChecklist";
import { MoodCheckIn } from "@/components/serenity/MoodCheckIn";
import { WeeklyMedsGrid } from "@/components/serenity/WeeklyMedsGrid";
import { ChatPanel } from "@/components/serenity/ChatPanel";
import { CaregiverDashboard } from "@/components/serenity/CaregiverDashboard";
import logo from "@/assets/serenity-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Serenity — A gentle home assistant for older adults" },
      {
        name: "description",
        content:
          "Serenity is a warm AI home assistant for older adults. Daily check-ins, medication reminders, routine monitoring, and a calm caregiver dashboard.",
      },
      { property: "og:title", content: "Serenity — A gentle home assistant" },
      {
        property: "og:description",
        content:
          "Pastel, senior-friendly dashboard with med reminders, mood check-ins, and caregiver alerts.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<View>("home");
  return (
    <SerenityProvider>
      <Toaster richColors position="top-center" />
      <div className="min-h-dvh bg-background">
        <nav
          aria-label="Primary"
          className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-8"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-bold text-foreground">Serenity</span>
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </nav>

        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          {view === "home" ? (
            <div className="flex flex-col gap-6">
              <Greeting />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <NextMedCard />
                <RoutineChecklist />
                <MoodCheckIn />
              </div>
              <WeeklyMedsGrid />
              <ChatPanel />
            </div>
          ) : (
            <CaregiverDashboard />
          )}
        </main>

        <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-center text-sm text-muted-foreground md:px-8">
          Serenity is a companion, not a medical device. In an emergency, call 911.
        </footer>
      </div>
    </SerenityProvider>
  );
}
