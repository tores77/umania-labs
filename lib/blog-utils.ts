import readingTime from "reading-time";
import type { Article } from "@/lib/supabase/server";

export type BlogListItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
};

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
