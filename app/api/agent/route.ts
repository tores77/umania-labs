import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { AGENT_GEO_CONTEXT, AGENT_SYSTEM_PROMPT } from "@/lib/agent-prompt";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "no_api_key" }, { status: 503 });
    }

    const body = await request.json();
    const { messages, locale, context } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      locale?: string;
      context?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const langHint =
      locale === "en"
        ? "The user is browsing the English version. Respond in English."
        : "El usuario navega la versión en español. Responde en español.";

    const geoHint = context === "geo" ? `\n\n${AGENT_GEO_CONTEXT}` : "";

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: `${AGENT_SYSTEM_PROMPT}\n\n${langHint}${geoHint}`,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const message = textBlock && "text" in textBlock ? textBlock.text : "";

    return NextResponse.json({ message });
  } catch (err) {
    const error = err as { status?: number; message?: string };

    if (error.status === 429) {
      return NextResponse.json({ error: "rate_limit" }, { status: 429 });
    }

    console.error("[agent]", error.message ?? err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
