import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  CHAT_SYSTEM_PROMPT,
  chatModelConfig,
  getAnthropicChatModel,
} from "@/lib/ai-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: UIMessage[] };

    if (!body.messages || body.messages.length === 0) {
      return Response.json({ error: "Messages array is required." }, { status: 400 });
    }

    const result = streamText({
      model: getAnthropicChatModel(),
      system: CHAT_SYSTEM_PROMPT,
      messages: await convertToModelMessages(body.messages),
      maxOutputTokens: chatModelConfig.maxOutputTokens,
      temperature: chatModelConfig.temperature,
      abortSignal: request.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process chat request.";

    return Response.json({ error: message }, { status: 500 });
  }
}
