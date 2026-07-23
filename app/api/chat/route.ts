import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { streamMockMarkdownResponse } from "@/lib/mock-chat-stream";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: UIMessage[] };

    if (!body.messages || body.messages.length === 0) {
      return Response.json({ error: "Messages array is required." }, { status: 400 });
    }

    const stream = createUIMessageStream({
      originalMessages: body.messages,
      execute: async ({ writer }) => {
        await streamMockMarkdownResponse({
          writer,
          abortSignal: request.signal,
        });
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process chat request.";

    return Response.json({ error: message }, { status: 500 });
  }
}
