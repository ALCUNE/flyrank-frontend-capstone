import type { SiteAuditResult, SiteAuditStatus } from "@/lib/tools/get-site-audit";

const statusStyles: Record<
  SiteAuditStatus,
  { badge: string; label: string; ring: string }
> = {
  healthy: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    label: "Healthy",
    ring: "ring-emerald-200 dark:ring-emerald-900",
  },
  warning: {
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
    label: "Needs Attention",
    ring: "ring-amber-200 dark:ring-amber-900",
  },
  critical: {
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    label: "Critical",
    ring: "ring-red-200 dark:ring-red-900",
  },
};

type AuditResultCardProps = {
  result: SiteAuditResult;
};

function ScoreMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function AuditResultCard({ result }: AuditResultCardProps) {
  const status = statusStyles[result.status];

  return (
    <article
      className={
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 transition-all duration-300 dark:border-slate-700 dark:bg-slate-950 " +
        status.ring
      }
      aria-label={`Site audit results for ${result.url}`}
    >
      <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Site Audit
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {result.url}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Audited {new Date(result.auditedAt).toLocaleString()}
            </p>
          </div>
          <span
            className={
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide " +
              status.badge
            }
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:grid-cols-3 sm:px-5">
        <ScoreMeter label="SEO" value={result.scores.seo} />
        <ScoreMeter label="Performance" value={result.scores.performance} />
        <ScoreMeter label="Accessibility" value={result.scores.accessibility} />
      </div>

      <div className="grid gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:grid-cols-2 sm:px-5">
        <Metric label="Page Size" value={`${result.metrics.pageSizeKb} KB`} />
        <Metric label="Load Time" value={`${result.metrics.loadTimeMs} ms`} />
        <Metric label="Broken Links" value={String(result.metrics.brokenLinks)} />
        <Metric
          label="Mobile Friendly"
          value={result.metrics.mobileFriendly ? "Yes" : "No"}
        />
      </div>

      <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Recommendations
        </h4>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {result.recommendations.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-blue-600 dark:text-blue-400">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}
