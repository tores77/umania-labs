import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getBlogTranslationSlug } from "@/lib/blog-slugs";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image: string;
  readingTime: string;
  locale: string;
  translationSlug: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function localeDir(locale: string) {
  return path.join(CONTENT_DIR, locale);
}

function parseFrontmatter(data: Record<string, unknown>, content: string): BlogPostMeta {
  const stats = readingTime(content);
  return {
    slug: String(data.slug ?? ""),
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    image: String(data.image ?? ""),
    readingTime: String(data.readingTime ?? `${Math.max(1, Math.ceil(stats.minutes))} min`),
    locale: String(data.locale ?? ""),
    translationSlug: String(
      data.translationSlug ??
        getBlogTranslationSlug(String(data.slug ?? ""), String(data.locale ?? "es") as "es" | "en")
    ),
  };
}

export function getAllPosts(locale: string): BlogPostMeta[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return parseFrontmatter(data, content);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const meta = parseFrontmatter(data, content);
    if (meta.slug === slug) {
      return { ...meta, content };
    }
  }

  return null;
}

export function getRelatedPosts(
  tags: string[],
  locale: string,
  excludeSlug?: string
): BlogPostMeta[] {
  return getAllPosts(locale)
    .filter((post) => post.slug !== excludeSlug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);
}

export function getAllPostParams(): Array<{ locale: string; slug: string }> {
  return ["es", "en"].flatMap((locale) =>
    getAllPosts(locale).map((post) => ({ locale, slug: post.slug }))
  );
}
