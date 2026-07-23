import { generateId, type UIMessage, type UIMessageStreamWriter } from "ai";

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

\`\`\`tsx
<button aria-expanded={isOpen} aria-controls="details-panel">
  Toggle details
</button>
\`\`\`

This response is streamed locally in chunks so the UI can demonstrate thinking states, markdown rendering, and abort handling without an external Anthropic API key.
`;

const STREAM_CHUNK_SIZE = 18;
const STREAM_CHUNK_DELAY_MS = 45;

type StreamMockMarkdownOptions = {
  writer: UIMessageStreamWriter<UIMessage>;
  abortSignal?: AbortSignal;
  content?: string;
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

export async function streamMockMarkdownResponse({
  writer,
  abortSignal,
  content = MOCK_MARKDOWN_RESPONSE,
}: StreamMockMarkdownOptions): Promise<void> {
  const textId = generateId();

  writer.write({ type: "start" });
  writer.write({ type: "text-start", id: textId });

  try {
    for (const chunk of splitIntoChunks(content, STREAM_CHUNK_SIZE)) {
      await sleep(STREAM_CHUNK_DELAY_MS, abortSignal);
      writer.write({ type: "text-delta", id: textId, delta: chunk });
    }

    writer.write({ type: "text-end", id: textId });
    writer.write({ type: "finish", finishReason: "stop" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      writer.write({ type: "text-end", id: textId });
      writer.write({ type: "abort" });
      return;
    }

    throw error;
  }
}

export function getMockMarkdownPreview(): string {
  return MOCK_MARKDOWN_RESPONSE;
}
