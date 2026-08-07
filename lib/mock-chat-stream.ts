import { generateId, type UIMessage, type UIMessageStreamWriter } from "ai";
import { extractSiteAuditRequest, getMessageText } from "@/lib/chat-types";
import {
  executeSiteAudit,
  getSiteAudit,
  type SiteAuditInput,
} from "@/lib/tools/get-site-audit";

const STREAM_CHUNK_SIZE = 18;
const STREAM_CHUNK_DELAY_MS = 45;
const TOOL_INPUT_CHUNK_DELAY_MS = 35;

const MOCK_MARKDOWN_RESPONSE = `## React, Next.js & Accessibility

Building accessible interfaces in a **Next.js App Router** project combines three core practices:

### React component design
- Prefer semantic HTML before reaching for ARIA attributes.
- Keep validation logic in TypeScript with explicit, testable rules.
- Use client components only when browser state or effects are required.

### Next.js architecture
- Route handlers keep secrets and provider keys on the server.
- Streaming responses improve perceived latency for chat experiences.
- \`useChat\` works best with UI message stream responses from the AI SDK.

### Accessibility (WCAG)
- Associate every input with a visible \`<label>\`.
- Expose validation state with \`aria-invalid\` and \`aria-describedby\`.
- Announce dynamic errors using \`role="alert"\` regions.

This response is streamed locally so the UI can demonstrate thinking states, markdown rendering, and abort handling without an external provider API key.
`;

type StreamOptions = {
  writer: UIMessageStreamWriter<UIMessage>;
  abortSignal?: AbortSignal;
};

type StreamMockChatOptions = StreamOptions & {
  messages: UIMessage[];
};

function sleep(ms: number, abortSignal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (abortSignal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = setTimeout(() => {
      abortSignal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    };

    abortSignal?.addEventListener("abort", onAbort, { once: true });
  });
}

function splitIntoChunks(content: string, chunkSize: number): string[] {
  const chunks: string[] = [];

  for (let index = 0; index < content.length; index += chunkSize) {
    chunks.push(content.slice(index, index + chunkSize));
  }

  return chunks;
}

function getLatestUserMessageText(messages: UIMessage[]): string {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  return getMessageText(latestUserMessage);
}

async function streamTextContent({
  writer,
  abortSignal,
  content,
}: StreamOptions & { content: string }): Promise<void> {
  const textId = generateId();

  writer.write({ type: "text-start", id: textId });

  for (const chunk of splitIntoChunks(content, STREAM_CHUNK_SIZE)) {
    await sleep(STREAM_CHUNK_DELAY_MS, abortSignal);
    writer.write({ type: "text-delta", id: textId, delta: chunk });
  }

  writer.write({ type: "text-end", id: textId });
}

async function streamToolInput({
  writer,
  abortSignal,
  toolCallId,
  input,
}: StreamOptions & {
  toolCallId: string;
  input: SiteAuditInput;
}): Promise<void> {
  writer.write({
    type: "tool-input-start",
    toolCallId,
    toolName: "getSiteAudit",
    title: "Site Audit",
  });

  const serializedInput = JSON.stringify(input);

  for (const chunk of splitIntoChunks(serializedInput, 6)) {
    await sleep(TOOL_INPUT_CHUNK_DELAY_MS, abortSignal);
    writer.write({
      type: "tool-input-delta",
      toolCallId,
      inputTextDelta: chunk,
    });
  }

  writer.write({
    type: "tool-input-available",
    toolCallId,
    toolName: "getSiteAudit",
    input,
  });
}

export async function streamMockSiteAuditTool({
  writer,
  abortSignal,
  url,
  forceError = false,
}: StreamOptions & {
  url: string;
  forceError?: boolean;
}): Promise<void> {
  const toolCallId = generateId();
  const input: SiteAuditInput = { url: forceError ? "fail.example.com" : url };

  writer.write({ type: "start" });
  writer.write({ type: "start-step" });

  await streamTextContent({
    writer,
    abortSignal,
    content: `I'll run **getSiteAudit** for \`${input.url}\` and stream the tool lifecycle back to the UI.`,
  });

  await streamToolInput({
    writer,
    abortSignal,
    toolCallId,
    input,
  });

  try {
    const output = await executeSiteAudit(input);
    writer.write({
      type: "tool-output-available",
      toolCallId,
      output,
    });

    await streamTextContent({
      writer,
      abortSignal,
      content: `\n\nAudit complete. Overall status: **${output.status}**. Review the scorecard below for SEO, performance, and accessibility metrics.`,
    });
  } catch (error) {
    const errorText =
      error instanceof Error ? error.message : "Site audit failed unexpectedly.";

    writer.write({
      type: "tool-output-error",
      toolCallId,
      errorText,
    });

    await streamTextContent({
      writer,
      abortSignal,
      content:
        "\n\nThe audit tool returned an error. You can retry with a different URL or inspect the failure details below.",
    });
  }

  writer.write({ type: "finish-step" });
  writer.write({ type: "finish", finishReason: "stop" });
}

export async function streamMockMarkdownResponse({
  writer,
  abortSignal,
  content = MOCK_MARKDOWN_RESPONSE,
}: StreamOptions & { content?: string }): Promise<void> {
  writer.write({ type: "start" });

  try {
    await streamTextContent({ writer, abortSignal, content });
    writer.write({ type: "finish", finishReason: "stop" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      writer.write({ type: "abort" });
      return;
    }

    throw error;
  }
}

export async function streamMockChatResponse({
  writer,
  abortSignal,
  messages,
}: StreamMockChatOptions): Promise<void> {
  const latestPrompt = getLatestUserMessageText(messages);
  const auditRequest = extractSiteAuditRequest(latestPrompt);

  if (auditRequest) {
    await streamMockSiteAuditTool({
      writer,
      abortSignal,
      url: auditRequest.url,
      forceError: auditRequest.forceError,
    });
    return;
  }

  await streamMockMarkdownResponse({ writer, abortSignal });
}

export { getSiteAudit, MOCK_MARKDOWN_RESPONSE };
