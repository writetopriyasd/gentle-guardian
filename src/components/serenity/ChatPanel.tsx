import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import { MessageCircleHeart, Send } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import logo from "@/assets/serenity-logo.png";
import { toast } from "sonner";

const QUICK_REPLIES = [
  "I took my pill",
  "I'm feeling great today",
  "Remind me about lunch",
  "I'd like to call my daughter",
];

export function ChatPanel() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (err) => {
      console.error(err);
      toast.error("Serenity couldn't reach the assistant. Please try again in a moment.");
    },
  });
  const [input, setInput] = useState("");
  const isBusy = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    const t = text.trim();
    if (!t || isBusy) return;
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <section className="flex h-[640px] flex-col overflow-hidden rounded-3xl bg-card shadow-sm">
      <header className="flex items-center gap-3 border-b border-border bg-mint/20 px-6 py-4">
        <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
        <div className="flex-1">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <MessageCircleHeart className="h-5 w-5 text-blush" aria-hidden /> Talk to Serenity
          </h2>
          <p className="text-sm text-muted-foreground">
            Warm, gentle, and always here. Not for emergencies — please call 911 in a crisis.
          </p>
        </div>
      </header>

      <Conversation className="flex-1 bg-background/40">
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              icon={<img src={logo} alt="" width={64} height={64} className="h-16 w-16" />}
              title="Hello there."
              description="Tell me how you're doing, or pick one of the suggestions below."
            />
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.role === "assistant" ? (
                  <MessageResponse className="text-lg leading-relaxed">
                    {m.parts
                      .filter((p) => p.type === "text")
                      .map((p) => (p as { text: string }).text)
                      .join("")}
                  </MessageResponse>
                ) : (
                  <p className="text-lg leading-relaxed">
                    {m.parts
                      .filter((p) => p.type === "text")
                      .map((p) => (p as { text: string }).text)
                      .join("")}
                  </p>
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Serenity is thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-card p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={isBusy}
              className="rounded-full bg-periwinkle/30 px-4 py-2 text-base font-semibold text-foreground transition-colors hover:bg-periwinkle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-3"
        >
          <label htmlFor="serenity-input" className="sr-only">
            Message Serenity
          </label>
          <textarea
            id="serenity-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            autoFocus
            placeholder="Type a message…"
            className="min-h-14 flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            aria-label="Send message"
            className="flex min-h-14 min-w-14 items-center justify-center rounded-2xl bg-primary px-5 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <Send className="h-6 w-6" aria-hidden />
          </button>
        </form>
      </div>
    </section>
  );
}