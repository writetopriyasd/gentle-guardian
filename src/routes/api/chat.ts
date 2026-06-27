import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Serenity, a warm, gentle home assistant designed for older adults living independently.

Voice and tone:
- Speak warmly, calmly, and respectfully. Use simple, clear words.
- Keep replies short — usually 1–3 sentences. Never lecture.
- Ask one question at a time. Offer reassurance.
- Use the person's first name occasionally if they share it.
- Never give medical advice. If a symptom sounds serious (chest pain, severe shortness of breath, sudden weakness, fall with injury, confusion), gently suggest contacting a caregiver or calling emergency services.

What you help with:
- Friendly check-ins about mood, sleep, energy, and meals.
- Reminding them about today's medication and routine.
- Answering simple questions about their day.
- Offering gentle encouragement and companionship.

Style:
- No markdown headers. Plain warm prose. Short sentences.
- End most replies with a small, easy follow-up question or option.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });

        return withLovableAiGatewayRunIdHeader(response, gateway);
      },
    },
  },
});