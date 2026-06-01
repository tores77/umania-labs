import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getAllPostParams,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { getBlogLanguageSlugs } from "@/lib/blog-slugs";
import { renderBlogMDX } from "@/lib/render-mdx";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) return {};

  const { es: esSlug, en: enSlug } = getBlogLanguageSlugs(slug, locale);
  const imagePath = post.image || "/og-default.jpg";
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : `${SITE_URL}${imagePath}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
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
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

function ArticleJsonLd({
  post,
  locale,
}: {
  post: NonNullable<ReturnType<typeof getPostBySlug>>;
  locale: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.date,
    image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
    publisher: {
      "@type": "Organization",
      name: "Umania Labs",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${locale}/blog/${post.slug}`,
    },
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

  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const Content = await renderBlogMDX(post.content);
  const related = getRelatedPosts(post.tags, locale, post.slug);

  return (
    <>
      <ArticleJsonLd post={post} locale={locale} />
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
              dateTime={post.date}
              className="text-label"
              style={{
                color: "var(--fg-muted)",
                fontSize: 10,
                display: "block",
                marginBottom: 16,
              }}
            >
              {new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {post.readingTime}
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
              {post.title}
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--fg-muted)",
                lineHeight: 1.65,
                margin: "0 0 20px",
              }}
            >
              {post.description}
            </p>
            <p
              className="text-label"
              style={{ color: "var(--accent)", fontSize: 10, margin: "0 0 16px" }}
            >
              {post.author}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {post.tags.map((tag) => (
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

          <div className="blog-article-content">
            <Content />
          </div>

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
