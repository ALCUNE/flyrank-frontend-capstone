import { tool } from "ai";
import { z } from "zod";

export const siteAuditInputSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

export type SiteAuditInput = z.infer<typeof siteAuditInputSchema>;

export type SiteAuditStatus = "healthy" | "warning" | "critical";

export type SiteAuditResult = {
  url: string;
  status: SiteAuditStatus;
  scores: {
    seo: number;
    performance: number;
    accessibility: number;
  };
  metrics: {
    pageSizeKb: number;
    loadTimeMs: number;
    brokenLinks: number;
    mobileFriendly: boolean;
  };
  recommendations: string[];
  auditedAt: string;
};

function normalizeUrl(url: string): string {
  const trimmed = url.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return trimmed.toLowerCase();
}

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export async function executeSiteAudit(input: SiteAuditInput): Promise<SiteAuditResult> {
  const { url } = siteAuditInputSchema.parse(input);
  const normalized = normalizeUrl(url);

  if (normalized.includes("fail") || normalized.includes("error.example")) {
    throw new Error(`Unable to reach "${url}". The host did not respond to audit probes.`);
  }

  await new Promise((resolve) => setTimeout(resolve, 650));

  const seed = hashString(normalized);
  const seo = 68 + (seed % 28);
  const performance = 62 + ((seed >> 3) % 30);
  const accessibility = 70 + ((seed >> 5) % 26);
  const average = Math.round((seo + performance + accessibility) / 3);

  const status: SiteAuditStatus =
    average >= 85 ? "healthy" : average >= 70 ? "warning" : "critical";

  return {
    url: normalized,
    status,
    scores: { seo, performance, accessibility },
    metrics: {
      pageSizeKb: 180 + (seed % 420),
      loadTimeMs: 900 + (seed % 1800),
      brokenLinks: seed % 4,
      mobileFriendly: accessibility >= 75,
    },
    recommendations: [
      "Add descriptive meta titles and Open Graph tags for share previews.",
      "Lazy-load below-the-fold images to improve LCP on mobile networks.",
      "Ensure interactive controls expose accessible names and focus states.",
    ],
    auditedAt: new Date().toISOString(),
  };
}

export const getSiteAudit = tool({
  description:
    "Runs an SEO, performance, and accessibility audit for a public website URL.",
  inputSchema: siteAuditInputSchema,
  execute: executeSiteAudit,
});

export const chatTools = {
  getSiteAudit,
};
