import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";
import ServiceHeroHotel from "@/components/services/ServiceHeroHotel";
import ServiceSectionPainPoints from "@/components/services/ServiceSectionPainPoints";
import ServiceSectionIncludes from "@/components/services/ServiceSectionIncludes";
import ServiceGallery from "@/components/services/ServiceGallery";
import ServiceSectionAudience from "@/components/services/ServiceSectionAudience";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCTA from "@/components/services/ServiceCTA";
import { buildFaqPageJsonLd } from "@/lib/blog-utils";
import {
  buildServiceLanguageAlternates,
  getServiceByPathname,
  getServiceCanonicalUrl,
} from "@/lib/services/registry";
import { whatsappHotelLink, SITE_URL } from "@/lib/constants";
import { routing, type Locale } from "@/i18n/routing";

export const revalidate = 60;

const SERVICE_PATHNAME = "/services/boutique-hotels" as const;
const SERVICE = getServiceByPathname(SERVICE_PATHNAME)!;

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: `servicePages.${SERVICE.messageKey}`,
  });

  const canonical = getServiceCanonicalUrl(SERVICE, locale as Locale);
  const languages = buildServiceLanguageAlternates(SERVICE);

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages,
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

function ServiceJsonLd({
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
    url: getServiceCanonicalUrl(SERVICE, locale as Locale),
    provider: {
      "@type": "Organization",
      name: "Umania Labs",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Place",
      name: "Mallorca, Balearic Islands, Spain",
    },
    serviceType: serviceName,
  };

  const faqSchema = faqPairs.length > 0 ? buildFaqPageJsonLd(faqPairs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

export default async function BoutiqueHotelsServicePage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations(`servicePages.${SERVICE.messageKey}`);
  const whatsappHref = whatsappHotelLink(locale as "es" | "en");
  const faqPairs = t.raw("faq.items") as Array<{ question: string; answer: string }>;

  return (
    <>
      <ServiceJsonLd
        locale={locale}
        serviceName={t("metaTitle")}
        serviceDescription={t("metaDescription")}
        faqPairs={faqPairs}
      />
      <main id="main-content" style={{ background: "var(--bg)" }}>
        <div
          className="section-padding"
          style={{ paddingTop: 100, paddingBottom: 0, maxWidth: 1200, margin: "0 auto" }}
        >
          <Link
            href="/"
            className="text-label"
            style={{
              color: "var(--fg-muted)",
              textDecoration: "none",
              fontSize: 10,
            }}
          >
            ← Umania Labs
          </Link>
        </div>

        <ServiceHeroHotel service={SERVICE} whatsappHref={whatsappHref} />
        <ServiceSectionPainPoints service={SERVICE} />
        <ServiceSectionIncludes service={SERVICE} />
        <ServiceGallery service={SERVICE} />
        <ServiceSectionAudience service={SERVICE} />
        <ServiceFAQ service={SERVICE} />
        <ServiceCTA service={SERVICE} whatsappHref={whatsappHref} />
        <Footer />
      </main>
    </>
  );
}
