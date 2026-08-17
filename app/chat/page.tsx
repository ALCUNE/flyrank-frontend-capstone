"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatErrorCard } from "@/components/chat/ChatErrorCard";
import { PromptChips } from "@/components/chat/PromptChips";
import { SiteAuditToolPart } from "@/components/chat/SiteAuditToolPart";
import { getMessageText, type ChatUIMessage } from "@/lib/chat-types";

const AUTO_SCROLL_THRESHOLD_PX = 80;

function ThinkingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
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

function MarkdownBlock({ text }: { text: string }) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-pre:my-2 prose-pre:overflow-x-auto prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-slate-900 dark:prose-code:bg-slate-800 dark:prose-code:text-slate-100">
      <ReactMarkdown>{text || " "}</ReactMarkdown>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatUIMessage }) {
  const isUser = message.role === "user";

  return (
    <article
      className={
        "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm transition-all duration-300 sm:max-w-[85%] " +
        (isUser
          ? "ml-auto bg-blue-600 text-white"
          : "mr-auto border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100")
      }
      aria-label={isUser ? "Your message" : "Assistant message"}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-80">
        {isUser ? "You" : "Assistant"}
      </p>

      {isUser ? (
        <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
      ) : (
        <div className="space-y-4">
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return <MarkdownBlock key={`${message.id}-text-${index}`} text={part.text} />;
            }

            if (part.type === "tool-getSiteAudit") {
              return <SiteAuditToolPart key={part.toolCallId} part={part} />;
            }

            return null;
          })}
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

  const { messages, sendMessage, stop, status, error, regenerate, clearError } =
    useChat<ChatUIMessage>({
      transport,
    });

  const isGenerating = status === "submitted" || status === "streaming";
  const showThinkingIndicator = status === "submitted" && !error;

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX;
  }, []);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status, showThinkingIndicator, error]);

  const handleRetry = useCallback(() => {
    clearError();
    void regenerate();
    shouldAutoScrollRef.current = true;
  }, [clearError, regenerate]);

  const submitPrompt = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) {
      return;
    }

    if (error) {
      clearError();
    }

    sendMessage({ text: trimmed });
    setInput("");
    shouldAutoScrollRef.current = true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitPrompt(input);
  };

  return (
    <div className="flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Streaming AI Chat
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                FE-08 — error recovery, onboarding, and mobile-safe streaming layout.
              </p>
            </div>
            <nav className="flex flex-wrap gap-2" aria-label="Page navigation">
              <Link
                href="/3d"
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:border-violet-400 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:border-violet-500 dark:hover:bg-violet-900/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                3D Experience
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
              >
                Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="mx-auto min-h-0 w-full max-w-4xl flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Chat conversation"
      >
        <div className="flex min-h-full flex-col gap-4">
          {messages.length === 0 ? (
            <ChatEmptyState disabled={isGenerating} onSelect={submitPrompt} />
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}

          {error ? <ChatErrorCard error={error} onRetry={handleRetry} /> : null}
          {showThinkingIndicator ? <ThinkingIndicator /> : null}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4"
          aria-label="Send a chat message"
        >
          {messages.length > 0 ? (
            <PromptChips disabled={isGenerating} onSelect={submitPrompt} grouped />
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
              placeholder="Ask a question or run: Run SEO Audit for flyrank.ai"
              disabled={isGenerating}
              className="min-h-[80px] flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900 sm:min-h-[88px] sm:resize-y"
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
