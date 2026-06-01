import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}${locale === "es" ? "/privacidad" : "/privacy"}`,
      languages: {
        es: `${SITE_URL}/es/privacidad`,
        en: `${SITE_URL}/en/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <main
      className="section section-padding"
      style={{ paddingTop: 120, maxWidth: 720, margin: "0 auto" }}
    >
      <Link
        href="/"
        className="text-label"
        style={{
          color: "var(--fg-muted)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 32,
        }}
      >
        ← Umania Labs
      </Link>
      <h1 className="section-title" style={{ marginBottom: 24 }}>
        {t("title")}
      </h1>
      <p style={{ fontSize: 16, color: "var(--fg-muted)", lineHeight: 1.7, margin: 0 }}>
        {t("body")}
      </p>
    </main>
  );
}
