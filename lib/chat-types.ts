import type { InferUITools, UIMessage } from "ai";
import type { chatTools } from "@/lib/tools/get-site-audit";

export type ChatUIMessage = UIMessage<unknown, never, InferUITools<typeof chatTools>>;

export type SuggestedPrompt = {
  id: string;
  label: string;
  message: string;
};

export const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "audit-flyrank",
    label: "Run SEO Audit for flyrank.ai",
    message: "Run SEO Audit for flyrank.ai",
  },
  {
    id: "audit-warning",
    label: "Audit demo-site.io",
    message: "Run a site audit for demo-site.io",
  },
  {
    id: "audit-error",
    label: "Simulate audit failure",
    message: "Run SEO audit for fail.example.com",
  },
  {
    id: "rsc",
    label: "Explain React Server Components",
    message: "Explain React Server Components in Next.js with one practical example.",
  },
];

export function getMessageText(message: UIMessage | undefined): string {
  if (!message) {
    return "";
  }

  return message.parts
    .filter((part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function extractSiteAuditRequest(text: string): { url: string; forceError: boolean } | null {
  const normalized = text.trim();
  const wantsAudit = /(audit|seo|site check|getsiteaudit)/i.test(normalized);

  const urlMatch = normalized.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/i);
  if (!urlMatch) {
    return wantsAudit ? { url: "example.com", forceError: false } : null;
  }

  const hostname = urlMatch[1].toLowerCase();
  const forceError = hostname.includes("fail") || hostname.includes("error.example");

  if (!wantsAudit && !/(flyrank|demo-site|fail\.example)/i.test(hostname)) {
    return null;
  }

  return { url: hostname, forceError };
}
