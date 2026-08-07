type ToolErrorStateProps = {
  title?: string;
  message: string;
  toolName?: string;
};

export function ToolErrorState({
  title = "Tool execution failed",
  message,
  toolName = "getSiteAudit",
}: ToolErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 shadow-sm transition-all duration-300 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200"
        >
          !
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 leading-6">{message}</p>
          <p className="mt-2 text-xs uppercase tracking-wide opacity-80">Tool: {toolName}</p>
        </div>
      </div>
    </div>
  );
}
