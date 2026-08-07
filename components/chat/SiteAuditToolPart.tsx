import type { ChatUIMessage } from "@/lib/chat-types";
import type { SiteAuditResult } from "@/lib/tools/get-site-audit";
import { AuditResultCard } from "@/components/chat/AuditResultCard";
import { ToolErrorState } from "@/components/chat/ToolErrorState";

type SiteAuditToolPart = Extract<ChatUIMessage["parts"][number], { type: "tool-getSiteAudit" }>;

type SiteAuditToolPartProps = {
  part: SiteAuditToolPart;
};

function ToolStatusCard({
  title,
  description,
  stateLabel,
  showPulse = false,
}: {
  title: string;
  description: string;
  stateLabel: string;
  showPulse?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {title}
          </p>
          <p className="mt-2 leading-6 text-slate-700 dark:text-slate-200">{description}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-700">
          {stateLabel}
        </span>
      </div>
      {showPulse ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:240ms]" />
          </span>
          Streaming tool input…
        </div>
      ) : null}
    </div>
  );
}

function getPartialUrl(part: SiteAuditToolPart): string | undefined {
  if ("input" in part && part.input && typeof part.input.url === "string") {
    return part.input.url;
  }

  return undefined;
}

export function SiteAuditToolPart({ part }: SiteAuditToolPartProps) {
  switch (part.state) {
    case "input-streaming": {
      const partialUrl = getPartialUrl(part);
      return (
        <ToolStatusCard
          title="getSiteAudit"
          description={
            partialUrl
              ? `Collecting audit parameters for ${partialUrl}…`
              : "Collecting audit parameters from the prompt…"
          }
          stateLabel="Input Streaming"
          showPulse
        />
      );
    }
    case "input-available":
      return (
        <ToolStatusCard
          title="getSiteAudit"
          description={`Running SEO, performance, and accessibility checks for ${part.input.url}…`}
          stateLabel="Executing"
        />
      );
    case "output-available":
      return <AuditResultCard result={part.output as SiteAuditResult} />;
    case "output-error":
      return (
        <ToolErrorState
          message={part.errorText}
          toolName="getSiteAudit"
        />
      );
    default:
      return null;
  }
}
