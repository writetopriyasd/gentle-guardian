import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type MedStatus = "upcoming" | "taken" | "missed" | "snoozed" | "skipped";

export type Medication = {
  id: string;
  name: string;
  dose: string;
  time: string; // HH:MM 24h
  status: MedStatus;
  weekly?: boolean;
};

export type RoutineItem = { id: string; label: string; time: string; done: boolean };

export type MoodEntry = { id: string; score: 1 | 2 | 3 | 4 | 5; note?: string; at: number };

export type Alert = {
  id: string;
  kind: "missed_med" | "low_mood" | "missed_checkin" | "manual";
  title: string;
  detail: string;
  at: number;
  acknowledged?: boolean;
};

type Ctx = {
  userName: string;
  meds: Medication[];
  routine: RoutineItem[];
  moods: MoodEntry[];
  alerts: Alert[];
  lastCheckInAt: number | null;
  setMedStatus: (id: string, status: MedStatus) => void;
  toggleRoutine: (id: string) => void;
  logMood: (score: MoodEntry["score"], note?: string) => void;
  pushAlert: (a: Omit<Alert, "id" | "at">) => void;
  ackAlert: (id: string) => void;
};

const SerenityCtx = createContext<Ctx | null>(null);

const todayMeds = (): Medication[] => [
  { id: "m1", name: "Lisinopril", dose: "10 mg", time: "08:00", status: "taken" },
  { id: "m2", name: "Metformin", dose: "500 mg", time: "13:00", status: "upcoming" },
  { id: "m3", name: "Vitamin D", dose: "1000 IU", time: "18:00", status: "upcoming" },
  { id: "m4", name: "Atorvastatin", dose: "20 mg", time: "21:00", status: "upcoming" },
  { id: "m5", name: "B12 Injection", dose: "1 ml", time: "10:00 Mon", status: "upcoming", weekly: true },
];

const todayRoutine = (): RoutineItem[] => [
  { id: "r1", label: "Wake up & wash", time: "7:00 AM", done: true },
  { id: "r2", label: "Breakfast", time: "8:00 AM", done: true },
  { id: "r3", label: "Morning walk", time: "9:30 AM", done: true },
  { id: "r4", label: "Lunch", time: "12:30 PM", done: false },
  { id: "r5", label: "Afternoon rest", time: "2:00 PM", done: false },
  { id: "r6", label: "Dinner", time: "6:00 PM", done: false },
  { id: "r7", label: "Wind down", time: "9:00 PM", done: false },
];

export function SerenityProvider({ children }: { children: ReactNode }) {
  const [userName] = useState("Margaret");
  const [meds, setMeds] = useState<Medication[]>(todayMeds);
  const [routine, setRoutine] = useState<RoutineItem[]>(todayRoutine);
  const [moods, setMoods] = useState<MoodEntry[]>([
    { id: "seed1", score: 4, at: Date.now() - 1000 * 60 * 60 * 26 },
    { id: "seed2", score: 3, at: Date.now() - 1000 * 60 * 60 * 50 },
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastCheckInAt, setLastCheckInAt] = useState<number | null>(null);

  const pushAlert = useCallback((a: Omit<Alert, "id" | "at">) => {
    setAlerts((prev) => [{ ...a, id: crypto.randomUUID(), at: Date.now() }, ...prev]);
  }, []);

  const setMedStatus = useCallback(
    (id: string, status: MedStatus) => {
      setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      if (status === "missed") {
        const med = meds.find((m) => m.id === id);
        if (med) {
          pushAlert({
            kind: "missed_med",
            title: `Missed dose: ${med.name}`,
            detail: `Scheduled ${med.time} • ${med.dose}`,
          });
        }
      }
    },
    [meds, pushAlert],
  );

  const toggleRoutine = useCallback((id: string) => {
    setRoutine((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  }, []);

  const logMood = useCallback(
    (score: MoodEntry["score"], note?: string) => {
      const entry: MoodEntry = { id: crypto.randomUUID(), score, note, at: Date.now() };
      setMoods((prev) => [entry, ...prev]);
      setLastCheckInAt(Date.now());
      if (score <= 2) {
        pushAlert({
          kind: "low_mood",
          title: "Low mood reported",
          detail: `Margaret rated her mood ${score}/5${note ? ` — "${note}"` : ""}`,
        });
      }
    },
    [pushAlert],
  );

  const ackAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const value = useMemo<Ctx>(
    () => ({ userName, meds, routine, moods, alerts, lastCheckInAt, setMedStatus, toggleRoutine, logMood, pushAlert, ackAlert }),
    [userName, meds, routine, moods, alerts, lastCheckInAt, setMedStatus, toggleRoutine, logMood, pushAlert, ackAlert],
  );

  return <SerenityCtx.Provider value={value}>{children}</SerenityCtx.Provider>;
}

export function useSerenity() {
  const ctx = useContext(SerenityCtx);
  if (!ctx) throw new Error("useSerenity must be used inside SerenityProvider");
  return ctx;
}