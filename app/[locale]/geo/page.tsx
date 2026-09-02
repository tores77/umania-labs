import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeoLanding from "@/components/GeoLanding";
import { buildFaqPageJsonLd } from "@/lib/blog-utils";
import { SITE_URL } from "@/lib/constants";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "geoLanding" });
  const canonical = `${SITE_URL}/${locale}/geo`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: {
        es: `${SITE_URL}/es/geo`,
        en: `${SITE_URL}/en/geo`,
        "x-default": `${SITE_URL}/es/geo`,
      },
    },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonical,
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: t("metaTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: ["/og-default.jpg"],
    },
  };
}

function GeoJsonLd({
  locale,
  serviceName,
  serviceDescription,
  faqPairs,
}: {
  locale: string;
  serviceName: string;
  serviceDescription: string;
  faqPairs: Array<{ question: string; answer: string }>;
}) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    url: `${SITE_URL}/${locale}/geo`,
    provider: {
      "@type": "Organization",
      name: "Umania Labs",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Place",
      name: "Mallorca, Balearic Islands, Spain",
    },
    serviceType: "Generative Engine Optimization",
  };

  const faqSchema = buildFaqPageJsonLd(faqPairs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default async function GeoPage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("geoLanding");
  const faqPairs = t.raw("faq.items") as Array<{ question: string; answer: string }>;

  return (
    <>
      <GeoJsonLd
        locale={locale}
        serviceName={t("serviceName")}
        serviceDescription={t("serviceDescription")}
        faqPairs={faqPairs}
      />
      <GeoLanding />
    </>
  );
}
