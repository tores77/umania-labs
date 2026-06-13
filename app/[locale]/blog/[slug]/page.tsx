import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getArticles,
} from "@/lib/supabase/server";
import type { Article } from "@/lib/supabase/server";
import { getRelatedArticles, toBlogListItem } from "@/lib/blog-utils";
import { getBlogLanguageSlugs } from "@/lib/blog-slugs";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    return await getAllArticleSlugs();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const article = await getArticleBySlug(slug, locale);
    if (!article) return {};

    const { es: esSlug, en: enSlug } = getBlogLanguageSlugs(slug, locale);
    const seoTitle = article.seo_title || article.title;
    const seoDescription = article.seo_description;

    return {
      title: seoTitle,
      description: seoDescription,
      alternates: {
        canonical: `${SITE_URL}/${locale}/blog/${slug}`,
        languages: {
          es: `${SITE_URL}/es/blog/${esSlug}`,
          en: `${SITE_URL}/en/blog/${enSlug}`,
          "x-default": `${SITE_URL}/es/blog/${esSlug}`,
        },
      },
      openGraph: {
        type: "article",
        title: seoTitle,
        description: seoDescription,
        url: `${SITE_URL}/${locale}/blog/${article.slug}`,
        images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: seoTitle }],
        publishedTime: article.created_at,
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: ["/og-default.jpg"],
      },
    };
  } catch {
    return {};
  }
}

function BlogPostingJsonLd({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.seo_title || article.title,
    description: article.seo_description,
    datePublished: article.created_at,
    dateModified: article.created_at,
    image: `${SITE_URL}/og-default.jpg`,
    author: {
      "@type": "Organization",
      name: "Umania Labs",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Umania Labs",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/studio-door.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${locale}/blog/${article.slug}`,
    },
    keywords: (article.tags ?? []).join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let article: Article | null = null;
  let related: ReturnType<typeof toBlogListItem>[] = [];

  try {
    article = await getArticleBySlug(slug, locale);
    if (article) {
      const allArticles = await getArticles(locale);
      related = getRelatedArticles(allArticles, article.tags ?? [], article.slug);
    }
  } catch (error) {
    console.error("[blog] Failed to load article:", error);
    notFound();
  }

  if (!article) notFound();

  const t = await getTranslations("blog");
  const listItem = toBlogListItem(article);

  return (
    <>
      <BlogPostingJsonLd article={article} locale={locale} />
      <main
        id="main-content"
        style={{
          background: "var(--bg)",
          minHeight: "100vh",
          paddingTop: 100,
        }}
      >
        <article
          className="section-padding"
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          <Link
            href="/blog"
            className="text-label"
            style={{
              color: "var(--fg-muted)",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 32,
              fontSize: 10,
            }}
          >
            ← {t("back")}
          </Link>

          <header style={{ marginBottom: 48 }}>
            <time
              dateTime={listItem.date}
              className="text-label"
              style={{
                color: "var(--fg-muted)",
                fontSize: 10,
                display: "block",
                marginBottom: 16,
              }}
            >
              {new Date(listItem.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {listItem.readingTime}
            </time>
            <h1
              className="text-display"
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "var(--fg)",
                margin: "0 0 20px",
                lineHeight: 1.1,
              }}
            >
              {article.title}
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--fg-muted)",
                lineHeight: 1.65,
                margin: "0 0 20px",
              }}
            >
              {article.seo_description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {listItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-label"
                  style={{
                    fontSize: 9,
                    color: "var(--accent)",
                    border: "1px solid rgba(200,169,110,0.3)",
                    padding: "4px 10px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div
            className="blog-article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {related.length > 0 && (
            <aside
              style={{
                marginTop: 64,
                paddingTop: 32,
                borderTop: "1px solid var(--line)",
              }}
            >
              <h2
                className="text-label"
                style={{ color: "var(--fg-muted)", marginBottom: 20, fontSize: 10 }}
              >
                {t("related")}
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {related.map((item) => (
                  <li key={item.slug} style={{ marginBottom: 16 }}>
                    <Link
                      href={{ pathname: "/blog/[slug]", params: { slug: item.slug } }}
                      style={{
                        fontSize: 16,
                        color: "var(--fg)",
                        textDecoration: "none",
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                      }}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>
      </main>
    </>
  );
}
