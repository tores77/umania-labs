import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import BriefingForm from "@/components/BriefingForm";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const page = messages.briefing.page;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/briefing`,
      languages: {
        es: `${SITE_URL}/es/briefing`,
        en: `${SITE_URL}/en/briefing`,
      },
    },
  };
}

export default async function BriefingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("briefing");
  const tp = await getTranslations("briefing.page");
  const reasons = tp.raw("reasons") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <main
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        paddingTop: 100,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 64px)",
        }}
      >
        <p className="text-label" style={{ color: "#6b6560", marginBottom: 24 }}>
          {t("label")}
        </p>

        <h1
          className="text-display"
          style={{
            fontSize: "clamp(48px, 10vw, 88px)",
            color: "#f5f2ed",
            margin: "0 0 32px",
            lineHeight: 1.0,
          }}
        >
          {t("title")}
        </h1>

        <blockquote
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(22px, 3vw, 28px)",
            color: "#2DD4BF",
            fontStyle: "italic",
            margin: "0 0 64px",
            padding: 0,
            border: "none",
            lineHeight: 1.4,
          }}
        >
          &ldquo;{tp("thesis")}&rdquo;
        </blockquote>

        <section style={{ marginBottom: 64 }}>
          <h2
            className="text-display"
            style={{ fontSize: 32, color: "#f5f2ed", margin: "0 0 16px" }}
          >
            {tp("valueTitle")}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#6b6560",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {tp("valueDescription")}
          </p>
        </section>

        <section style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
            }}
          >
            {reasons.map((reason, i) => (
              <article
                key={i}
                style={{
                  border: "1px solid rgba(245, 242, 237, 0.08)",
                  padding: "28px 24px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 400,
                    fontSize: 16,
                    color: "#2DD4BF",
                    margin: "0 0 10px",
                  }}
                >
                  {reason.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#6b6560",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {reason.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            borderTop: "1px solid rgba(245, 242, 237, 0.08)",
            paddingTop: 48,
            marginBottom: 32,
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: "#6b6560",
              lineHeight: 1.65,
              margin: "0 0 28px",
            }}
          >
            {t("description")}
          </p>
          <BriefingForm layout="stacked" />
        </section>

        <p
          className="text-label"
          style={{ color: "#6b6560", textAlign: "center", marginTop: 48 }}
        >
          {tp("frequency")}
        </p>

        <p style={{ textAlign: "center", marginTop: 32 }}>
          <Link
            href="/"
            style={{
              fontSize: 13,
              color: "#6b6560",
              textDecoration: "none",
            }}
          >
            ← Umania Labs
          </Link>
        </p>
      </div>
    </main>
  );
}
