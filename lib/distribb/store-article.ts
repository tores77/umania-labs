import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredArticle = {
  articleId: string;
  title: string;
  content: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
};

export type ArticleIndexEntry = {
  articleId: string;
  title: string;
  createdAt: string;
  filename: string;
};

export type ArticleIndex = {
  articles: ArticleIndexEntry[];
};

const ARTICLES_DIR = path.join(process.cwd(), "public", "blog-articles");
const INDEX_PATH = path.join(ARTICLES_DIR, "index.json");

async function ensureArticlesDir(): Promise<void> {
  await mkdir(ARTICLES_DIR, { recursive: true });
}

async function readIndex(): Promise<ArticleIndex> {
  try {
    const raw = await readFile(INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw) as ArticleIndex;
    if (!Array.isArray(parsed.articles)) {
      return { articles: [] };
    }
    return parsed;
  } catch {
    return { articles: [] };
  }
}

export async function storeArticle(input: {
  title: string;
  content: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}): Promise<{ article: StoredArticle; filename: string }> {
  await ensureArticlesDir();

  const createdAt = new Date().toISOString();
  const articleId = randomUUID();
  const timestamp = Date.now();
  const filename = `article-${timestamp}.json`;

  const article: StoredArticle = {
    articleId,
    title: input.title,
    content: input.content,
    tags: input.tags,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    createdAt,
  };

  await writeFile(
    path.join(ARTICLES_DIR, filename),
    JSON.stringify(article, null, 2),
    "utf8",
  );

  const index = await readIndex();
  index.articles.unshift({
    articleId,
    title: article.title,
    createdAt,
    filename,
  });

  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");

  return { article, filename };
}
