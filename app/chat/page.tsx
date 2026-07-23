"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";

const AUTO_SCROLL_THRESHOLD_PX = 80;

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function ThinkingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      <span className="flex gap-1" aria-hidden="true">
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
      </span>
      Assistant is thinking…
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = getMessageText(message);

  return (
    <article
      className={
        "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[80%] " +
        (isUser
          ? "ml-auto bg-blue-600 text-white"
          : "mr-auto border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100")
      }
      aria-label={isUser ? "Your message" : "Assistant message"}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-80">
        {isUser ? "You" : "Assistant"}
      </p>

      {isUser ? (
        <p className="whitespace-pre-wrap">{text}</p>
      ) : (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-pre:my-2 prose-pre:overflow-x-auto prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-slate-900 dark:prose-code:bg-slate-800 dark:prose-code:text-slate-100">
          <ReactMarkdown>{text || " "}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const { messages, sendMessage, stop, status, error } = useChat({
    transport,
  });

  const isGenerating = status === "submitted" || status === "streaming";
  const showThinkingIndicator = status === "submitted";

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX;
  };

  useEffect(() => {
    if (!shouldAutoScrollRef.current) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status, showThinkingIndicator]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isGenerating) {
      return;
    }

    sendMessage({ text: trimmed });
    setInput("");
    shouldAutoScrollRef.current = true;
  };

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Streaming AI Chat</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Week 4 FE-06 — powered by Vercel AI SDK and Anthropic Claude.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Chat conversation"
      >
        <div className="flex flex-1 flex-col gap-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Ask about React patterns, accessibility, TypeScript validation, or this capstone
              project architecture.
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}

          {showThinkingIndicator ? <ThinkingIndicator /> : null}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:px-6"
          aria-label="Send a chat message"
        >
          {error ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error.message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <textarea
              id="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={3}
              placeholder="Ask the assistant anything about frontend development…"
              disabled={isGenerating}
              className="min-h-[88px] flex-1 resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900"
            />

            <div className="flex flex-row gap-2 sm:w-40 sm:flex-col">
              <button
                type="submit"
                disabled={isGenerating || input.trim().length === 0}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>

              {isGenerating ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  aria-label="Stop generating response"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Stop
                </button>
              ) : null}
            </div>
          </div>
        </form>
      </footer>
    </div>
  );
}
