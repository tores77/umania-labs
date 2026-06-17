import { parse } from "node-html-parser";
import readingTime from "reading-time";
import { SITE_URL } from "@/lib/constants";
import { getAlternateSlug, type Article } from "@/lib/supabase/server";

export type BlogListItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
};

export type FaqPair = {
  question: string;
  answer: string;
};

const H2_REGEX = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
const H3_OPEN_REGEX = /<h3\b[^>]*>/i;

function normalizeForMatch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtmlToPlainText(html: string): string {
  return parse(html).text.replace(/\s+/g, " ").trim();
}

function isFaqSectionHeading(text: string): boolean {
  const normalized = normalizeForMatch(text);
  return (
    normalized.includes("preguntas frecuentes") ||
    normalized.includes("frequently asked") ||
    normalized.includes("faq")
  );
}

function extractFaqSectionHtml(contentHtml: string): string | null {
  const matches = [...contentHtml.matchAll(H2_REGEX)];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const headingText = stripHtmlToPlainText(match[1] ?? "");

    if (!isFaqSectionHeading(headingText)) {
      continue;
    }

    const sectionStart = (match.index ?? 0) + match[0].length;
    const nextMatch = matches[index + 1];
    const sectionEnd = nextMatch?.index ?? contentHtml.length;

    return contentHtml.slice(sectionStart, sectionEnd);
  }

  return null;
}

function extractPairsFromSection(sectionHtml: string): FaqPair[] {
  const chunks = sectionHtml.split(H3_OPEN_REGEX).slice(1);
  const pairs: FaqPair[] = [];

  for (const chunk of chunks) {
    const closeTagIndex = chunk.search(/<\/h3>/i);
    if (closeTagIndex === -1) {
      continue;
    }

    const question = stripHtmlToPlainText(chunk.slice(0, closeTagIndex));
    const remainder = chunk.slice(closeTagIndex + 5);
    const nextQuestionIndex = remainder.search(H3_OPEN_REGEX);
    const answerHtml =
      nextQuestionIndex === -1 ? remainder : remainder.slice(0, nextQuestionIndex);
    const answer = stripHtmlToPlainText(answerHtml);

    if (question && answer) {
      pairs.push({ question, answer });
    }
  }

  return pairs;
}

export function extractFaqFromHtml(contentHtml: string): FaqPair[] {
  if (!contentHtml.trim()) {
    return [];
  }

  const sectionHtml = extractFaqSectionHtml(contentHtml);
  if (!sectionHtml) {
    return [];
  }

  return extractPairsFromSection(sectionHtml);
}

export function buildFaqPageJsonLd(pairs: FaqPair[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((pair) => ({
      "@type": "Question",
      name: pair.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: pair.answer,
      },
    })),
  };
}

export function toBlogListItem(article: Article): BlogListItem {
  const content = article.content ?? "";
  const plainText = content.replace(/<[^>]+>/g, " ");
  const stats = readingTime(plainText || " ");
  const tags = Array.isArray(article.tags) ? article.tags : [];

  return {
    slug: article.slug,
    title: article.title,
    description: article.seo_description ?? "",
    date: article.created_at ?? new Date().toISOString(),
    tags,
    readingTime: `${Math.max(1, Math.ceil(stats.minutes))} min`,
  };
}

export function getRelatedArticles(
  articles: Article[],
  tags: string[],
  excludeSlug: string,
): BlogListItem[] {
  return articles
    .filter((article) => article.slug !== excludeSlug)
    .map((article) => ({
      article,
      score: (article.tags ?? []).filter((tag) => tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ article }) => toBlogListItem(article));
}

export async function buildBlogLanguageAlternates(
  article: Article,
): Promise<Record<string, string> | undefined> {
  const translationKey = article.translation_key?.trim();
  if (!translationKey) return undefined;

  const locale = article.locale.trim().toLowerCase();
  const esSlug =
    locale === "es" ? article.slug : await getAlternateSlug(translationKey, "es");
  const enSlug =
    locale === "en" ? article.slug : await getAlternateSlug(translationKey, "en");

  const languages: Record<string, string> = {};

  if (esSlug) {
    languages.es = `${SITE_URL}/es/blog/${esSlug}`;
  }
  if (enSlug) {
    languages.en = `${SITE_URL}/en/blog/${enSlug}`;
  }
  if (esSlug) {
    languages["x-default"] = `${SITE_URL}/es/blog/${esSlug}`;
  }

  return Object.keys(languages).length > 0 ? languages : undefined;
}

export async function getBlogAlternateSlug(
  article: Article,
  targetLocale: string,
): Promise<string | null> {
  const translationKey = article.translation_key?.trim();
  if (!translationKey) return null;

  const currentLocale = article.locale.trim().toLowerCase();
  const normalizedTarget = targetLocale.trim().toLowerCase();

  if (currentLocale === normalizedTarget) {
    return article.slug;
  }

  return getAlternateSlug(translationKey, normalizedTarget);
}
