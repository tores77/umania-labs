import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Article = {
  article_id: string;
  title: string;
  content: string;
  seo_title: string;
  seo_description: string;
  slug: string;
  tags: string[];
  status: string;
  locale: string;
  translation_key?: string | null;
  created_at: string;
};

const PUBLISHED_STATUS = "published";

function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createClient(url, key, {
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          next: { revalidate: 60 },
        }),
    },
  });
}

function normalizeLocale(locale: string): string {
  return locale.trim().toLowerCase();
}

function isPublishedStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === PUBLISHED_STATUS;
}

export async function getArticles(locale: string): Promise<Article[]> {
  const supabase = createSupabaseClient();
  const normalizedLocale = normalizeLocale(locale);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("locale", normalizedLocale)
    .filter("status", "ilike", PUBLISHED_STATUS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Article[]).filter((article) =>
    isPublishedStatus(article.status),
  );
}

export async function getArticleBySlug(
  slug: string,
  locale: string,
): Promise<Article | null> {
  const supabase = createSupabaseClient();
  const normalizedLocale = normalizeLocale(locale);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("locale", normalizedLocale)
    .filter("status", "ilike", PUBLISHED_STATUS)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !isPublishedStatus(data.status)) {
    return null;
  }

  return data as Article;
}

export async function getAlternateSlug(
  translationKey: string,
  targetLocale: string,
): Promise<string | null> {
  const normalizedKey = translationKey.trim();
  if (!normalizedKey) return null;

  const supabase = createSupabaseClient();
  const normalizedLocale = normalizeLocale(targetLocale);

  const { data, error } = await supabase
    .from("articles")
    .select("slug, status")
    .eq("translation_key", normalizedKey)
    .eq("locale", normalizedLocale)
    .filter("status", "ilike", PUBLISHED_STATUS)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !isPublishedStatus(data.status)) {
    return null;
  }

  return data.slug;
}

export async function getAllArticleSlugs(): Promise<
  Array<{ locale: string; slug: string }>
> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("articles")
    .select("slug, locale, status")
    .filter("status", "ilike", PUBLISHED_STATUS);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Array<{ slug: string; locale: string; status: string }>)
    .filter((article) => isPublishedStatus(article.status))
    .map(({ slug, locale }) => ({
      slug,
      locale: normalizeLocale(locale),
    }));
}
