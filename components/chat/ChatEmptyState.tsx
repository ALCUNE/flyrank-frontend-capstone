import { PromptChips } from "@/components/chat/PromptChips";

export function ChatEmptyState({
  disabled,
  onSelect,
}: {
  disabled: boolean;
  onSelect: (message: string) => void;
}) {
  return (
    <section
      aria-labelledby="chat-empty-title"
      className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-4 sm:py-8"
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.5l1-1h3l1 1H17a2 2 0 012 2v11a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2
            id="chat-empty-title"
            className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl"
          >
            Start a streaming conversation
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            Explore markdown streaming, server tool calls, and error recovery — all without an
            external API key.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          title="Tool demos"
          description="Run the getSiteAudit server tool and inspect custom scorecards."
        />
        <FeatureCard
          title="Streaming UX"
          description="Watch tokens arrive incrementally with thinking and stop controls."
        />
        <FeatureCard
          title="Failure recovery"
          description="Trigger a mid-stream error, then retry with one click."
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-4 space-y-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Suggested prompts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pick a chip to send an example message instantly.
          </p>
        </div>
        <PromptChips disabled={disabled} onSelect={onSelect} grouped />
      </div>
    </section>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </article>
  );
}
