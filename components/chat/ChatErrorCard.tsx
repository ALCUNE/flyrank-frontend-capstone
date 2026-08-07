export type ChatErrorCardProps = {
  error: Error;
  onRetry: () => void;
};

export function ChatErrorCard({ error, onRetry }: ChatErrorCardProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 shadow-sm transition-all duration-300 dark:border-red-900 dark:bg-red-950/40"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 dark:bg-red-900/60 dark:text-red-200"
          >
            !
          </span>
          <div>
            <h2 className="text-sm font-semibold text-red-900 dark:text-red-100">
              Response interrupted
            </h2>
            <p className="mt-1 text-sm leading-6 text-red-800 dark:text-red-200">
              {error.message}
            </p>
            <p className="mt-2 text-xs text-red-700/80 dark:text-red-300/80">
              Your previous messages are preserved. Retry to regenerate the assistant response.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900/60"
        >
          Retry / Reload
        </button>
      </div>
    </div>
  );
}
