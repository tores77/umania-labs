import { NextResponse } from "next/server";
import { sanitizeHtml } from "@/lib/distribb/sanitize-html";
import { storeArticle } from "@/lib/distribb/store-article";

const WEBHOOK_SECRET = "distribb-secret-key-umania-2026";
const EXPECTED_AUTH = `Bearer ${WEBHOOK_SECRET}`;

type DistribbPayload = {
  title?: unknown;
  content?: unknown;
  tags?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  publishedUrl?: unknown;
};

type ValidationResult =
  | {
      ok: true;
      data: {
        title: string;
        content: string;
        tags: string[];
        seoTitle: string;
        seoDescription: string;
      };
    }
  | { ok: false; error: string };

function logWebhook(event: {
  tokenValid: boolean;
  success: boolean;
  error?: string;
  articleId?: string;
}) {
  console.log("[distribb-webhook]", {
    timestamp: new Date().toISOString(),
    tokenValid: event.tokenValid,
    success: event.success,
    ...(event.error ? { error: event.error } : {}),
    ...(event.articleId ? { articleId: event.articleId } : {}),
  });
}

function validatePayload(body: DistribbPayload): ValidationResult {
  if (typeof body.title !== "string" || !body.title.trim()) {
    return { ok: false, error: "title is required" };
  }

  if (typeof body.content !== "string" || !body.content.trim()) {
    return { ok: false, error: "content is required" };
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) {
      return { ok: false, error: "tags must be an array of strings" };
    }
    if (!body.tags.every((tag) => typeof tag === "string")) {
      return { ok: false, error: "tags must be an array of strings" };
    }
  }

  if (typeof body.seoTitle !== "string") {
    return { ok: false, error: "seoTitle must be a string" };
  }

  if (typeof body.seoDescription !== "string") {
    return { ok: false, error: "seoDescription must be a string" };
  }

  if (
    body.publishedUrl !== undefined &&
    typeof body.publishedUrl !== "string"
  ) {
    return { ok: false, error: "publishedUrl must be a string" };
  }

  const tags = (body.tags ?? []) as string[];

  return {
    ok: true,
    data: {
      title: body.title.trim(),
      content: sanitizeHtml(body.content.trim()),
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      seoTitle: body.seoTitle.trim(),
      seoDescription: body.seoDescription.trim(),
    },
  };
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const tokenValid = authHeader === EXPECTED_AUTH;

  if (!tokenValid) {
    logWebhook({ tokenValid: false, success: false, error: "invalid token" });
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    let body: DistribbPayload;

    try {
      body = (await request.json()) as DistribbPayload;
    } catch {
      logWebhook({ tokenValid: true, success: false, error: "invalid JSON" });
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const validation = validatePayload(body);
    if (!validation.ok) {
      logWebhook({
        tokenValid: true,
        success: false,
        error: validation.error,
      });
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    const { article } = await storeArticle(validation.data);

    logWebhook({
      tokenValid: true,
      success: true,
      articleId: article.articleId,
    });

    return NextResponse.json(
      { success: true, articleId: article.articleId },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    logWebhook({ tokenValid: true, success: false, error: message });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
