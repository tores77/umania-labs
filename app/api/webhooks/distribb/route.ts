import { NextResponse } from "next/server";
import { sanitizeHtml } from "@/lib/distribb/sanitize-html";
import { storeArticle } from "@/lib/distribb/store-article";

const WEBHOOK_SECRET = "distribb-secret-key-umania-2026";
const EXPECTED_AUTH = `Bearer ${WEBHOOK_SECRET}`;

type DistribbArticle = {
  title?: unknown;
  slug?: unknown;
  content_html?: unknown;
  content_markdown?: unknown;
  meta_description?: unknown;
  image_url?: unknown;
  alt_text?: unknown;
  tags?: unknown;
  author?: unknown;
  status?: unknown;
};

type DistribbPayload = {
  data?: {
    articles?: unknown;
  };
};

type ValidationResult =
  | {
      ok: true;
      data: {
        articleId: string;
        slug: string;
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
  if (!body.data || !Array.isArray(body.data.articles)) {
    return { ok: false, error: "data.articles is required" };
  }

  if (body.data.articles.length === 0) {
    return { ok: false, error: "data.articles must contain at least one article" };
  }

  const article = body.data.articles[0] as DistribbArticle;

  if (typeof article.title !== "string" || !article.title.trim()) {
    return { ok: false, error: "title is required" };
  }

  if (typeof article.content_html !== "string" || !article.content_html.trim()) {
    return { ok: false, error: "content_html is required" };
  }

  if (article.tags !== undefined) {
    if (!Array.isArray(article.tags)) {
      return { ok: false, error: "tags must be an array of strings" };
    }
    if (!article.tags.every((tag) => typeof tag === "string")) {
      return { ok: false, error: "tags must be an array of strings" };
    }
  }

  const slug =
    typeof article.slug === "string" && article.slug.trim()
      ? article.slug.trim()
      : "article";
  const timestamp = Date.now();
  const articleId = `${slug}-${timestamp}`;
  const tags = (article.tags ?? []) as string[];
  const metaDescription =
    typeof article.meta_description === "string"
      ? article.meta_description.trim()
      : "";

  return {
    ok: true,
    data: {
      articleId,
      slug,
      title: article.title.trim(),
      content: sanitizeHtml(article.content_html.trim()),
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      seoTitle: article.title.trim(),
      seoDescription: metaDescription,
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
