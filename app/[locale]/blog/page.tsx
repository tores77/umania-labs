import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: {
        es: `${SITE_URL}/es/blog`,
        en: `${SITE_URL}/en/blog`,
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}/${locale}/blog`,
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const posts = getAllPosts(locale);

  return (
    <main
      id="main-content"
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        paddingTop: 100,
      }}
    >
      <div
        className="section-padding"
        style={{ maxWidth: 720, margin: "0 auto" }}
      >
        <p className="text-label" style={{ color: "var(--fg-muted)", marginBottom: 20 }}>
          {t("label")}
        </p>
        <h1 className="section-title" style={{ marginBottom: 48 }}>
          {t("title")}
        </h1>

        {posts.length === 0 ? (
          <p style={{ fontSize: 16, color: "var(--fg-muted)", lineHeight: 1.7 }}>
            {t("empty")}
          </p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {posts.map((post) => (
              <li
                key={post.slug}
                style={{
                  borderTop: "1px solid var(--line)",
                  padding: "32px 0",
                }}
              >
                <Link
                  href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <time
                    dateTime={post.date}
                    className="text-label"
                    style={{
                      color: "var(--fg-muted)",
                      fontSize: 10,
                      display: "block",
                      marginBottom: 12,
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
                  <h2
                    className="text-display"
                    style={{
                      fontSize: "clamp(24px, 4vw, 32px)",
                      color: "var(--fg)",
                      margin: "0 0 12px",
                      lineHeight: 1.15,
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 16,
                      color: "var(--fg-muted)",
                      lineHeight: 1.65,
                      margin: "0 0 16px",
                    }}
                  >
                    {post.description}
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
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p style={{ marginTop: 48 }}>
          <Link
            href="/"
            className="text-label"
            style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: 10 }}
          >
            ← Umania Labs
          </Link>
        </p>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}
