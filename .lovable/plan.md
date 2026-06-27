# Serenity — Home Assistant AI for Older Adults

A device-agnostic, senior-friendly home assistant with a calming pastel dashboard, conversational AI check-ins, medication reminders, routine monitoring, and an in-app caregiver view. Built in TanStack Start. Single ongoing conversation, no persistence (data resets each session).

## Design direction

- **Palette (from uploaded image):** mint `#9FD9B4`, periwinkle `#A9B8E8`, cream `#F4F2EA`, blush `#F2D0D4`, sky `#BFE3F5`. Mapped to semantic tokens in `src/styles.css` (oklch).
- **Senior-friendly UX:** large 18–22px body, 28–48px headings, high-contrast text on cream surfaces, big tap targets (≥56px), generous spacing, rounded-2xl cards, gentle shadows, no thin strokes, no hover-only affordances.
- **Typography:** Nunito (rounded, warm, highly legible) for both headings and body.
- **Tone:** warm, encouraging microcopy ("Good morning, Margaret. Ready for a quick check-in?").

## Layout

Single-page dashboard at `/` with a top toggle for **Home view** and **Caregiver view**.

```text
┌───────────────────────────────────────────────────────────┐
│  Serenity        [ Home | Caregiver ]      Today, time    │
├───────────────────────────────────────────────────────────┤
│  Greeting + today's status banner (mood / last check-in)  │
├──────────────────┬─────────────────────┬──────────────────┤
│  Next medication │  Today's routine    │  Health check-in │
│  big card + Took │  checklist (wake,   │  How are you     │
│  / Snooze        │  meals, walk, etc)  │  feeling? 1–5    │
├──────────────────┴─────────────────────┴──────────────────┤
│  Weekly meds schedule (7-day grid, taken/missed/upcoming) │
├───────────────────────────────────────────────────────────┤
│  Talk to Serenity  — chat composer + transcript           │
└───────────────────────────────────────────────────────────┘
```

Caregiver view shows: last check-in time, mood trend, today's adherence %, missed-med alerts, recent routine completion, and an "Alerts" feed.

## Features

1. **AI chat assistant (Serenity)** — single ongoing conversation, large-text bubbles, voice-style microcopy, quick-reply chips ("I took my pill", "I feel great", "Call my daughter"). Uses Lovable AI Gateway (`google/gemini-3-flash-preview`) via a TanStack server route. Assistant can answer questions, run a guided check-in, and acknowledge med doses.
2. **Medication reminders** — sample daily/weekly schedule in memory; cards show next dose with Took / Snooze 10 min / Skip. Missed doses flip to "Missed" and surface in caregiver alerts.
3. **Daily routine monitoring** — checklist (wake, breakfast, walk, lunch, meds, dinner, wind-down). Tap to mark done; progress ring summarizes the day.
4. **Health check-in** — 1–5 mood selector with emoji faces + optional note; logs to session state and feeds the caregiver mood trend.
5. **Caregiver dashboard (in-app)** — toggle in header; shows adherence, mood, last activity, and an alerts list. "Notify caregiver" buttons on missed meds / low mood push an alert into this feed.
6. **Accessibility** — high-contrast tokens, focus rings, semantic landmarks, prefers-reduced-motion respected, no color-only signaling (icons + text always paired).

## Technical details

- **Stack:** TanStack Start, Tailwind v4, shadcn/ui, AI SDK + AI Elements for chat.
- **Routes:**
  - `src/routes/index.tsx` — dashboard shell with Home/Caregiver toggle.
  - `src/routes/api/chat.ts` — `streamText` against Lovable AI Gateway with a Serenity system prompt (warm, concise, asks one thing at a time, suggests quick replies).
- **Provider helper:** `src/lib/ai-gateway.server.ts` using `@ai-sdk/openai-compatible` + `LOVABLE_API_KEY`.
- **State:** in-memory React context (`SerenityProvider`) holding meds, routine, mood log, alerts. No DB, no localStorage — resets on reload (per user choice).
- **Components (new):**
  - `src/components/serenity/Greeting.tsx`
  - `src/components/serenity/NextMedCard.tsx`
  - `src/components/serenity/RoutineChecklist.tsx`
  - `src/components/serenity/MoodCheckIn.tsx`
  - `src/components/serenity/WeeklyMedsGrid.tsx`
  - `src/components/serenity/ChatPanel.tsx` (AI Elements: Conversation, Message, MessageResponse, PromptInput, Shimmer)
  - `src/components/serenity/CaregiverDashboard.tsx`
  - `src/components/serenity/ViewToggle.tsx`
- **AI Elements install:** `bun x ai-elements@latest add conversation message prompt-input shimmer`.
- **Design tokens:** rewrite `:root` / `.dark` in `src/styles.css` to the pastel palette with oklch; add `--radius: 1rem`; add `--font-sans: Nunito`. Load Nunito via `@fontsource/nunito` imported in the root.
- **Identity:** generated rounded leaf/heart-style "Serenity" logo (not Sparkles) saved to `src/assets/`.
- **Enable Lovable Cloud:** not needed (no persistence, no auth). Lovable AI Gateway key `LOVABLE_API_KEY` provisioned for the chat route only.

## Out of scope (this iteration)

- Real caregiver accounts, email/SMS notifications, push reminders, voice I/O, multi-user data, persistence across reloads. (Easy to add later by enabling Lovable Cloud.)
