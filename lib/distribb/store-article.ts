import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createClient(url, key);
}

export async function storeArticle(input: {
  articleId: string;
  slug: string;
  title: string;
  content: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  status: string;
  locale?: string;
}): Promise<{ articleId: string }> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("articles")
    .insert({
      article_id: input.articleId,
      title: input.title,
      content: input.content,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
      slug: input.slug,
      tags: input.tags,
      status: input.status.trim().toLowerCase(),
      locale: (input.locale ?? "en").trim().toLowerCase(),
    })
    .select("article_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.article_id) {
    throw new Error("Supabase insert did not return article_id");
  }

  return { articleId: data.article_id };
}
