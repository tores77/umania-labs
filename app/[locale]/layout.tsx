import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";
import "../globals.css";

import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-mono",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const meta = messages.meta;
  const isEs = locale === "es";

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords.split(", "),
    authors: [{ name: "Umania Labs" }],
    creator: "Umania Labs",
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: isEs ? "es_ES" : "en_US",
      alternateLocale: isEs ? "en_US" : "es_ES",
      title: meta.title,
      description: meta.description,
      siteName: "Umania Labs",
      url: `${SITE_URL}/${locale}`,
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Umania Labs" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og-default.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

function JsonLd({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Umania Labs",
        url: SITE_URL,
        logo: `${SITE_URL}/studio-door.png`,
        description: isEs
          ? "Studio de diseño web premium en Mallorca"
          : "Premium web design studio in Mallorca",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mallorca",
          addressCountry: "ES",
        },
        sameAs: ["https://calendly.com/umanialabs"],
      },
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${SITE_URL}/#localbusiness`,
        name: "Umania Labs",
        url: SITE_URL,
        telephone: "+34676967465",
        email: "hola@umanialabs.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Palma",
          addressRegion: "Mallorca",
          addressCountry: "ES",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 39.5696,
          longitude: 2.6502,
        },
        areaServed: ["ES", "GB", "US"],
        priceRange: "€€€",
      },
      {
        "@type": "WebSite",
        name: "Umania Labs",
        url: `${SITE_URL}/${locale}`,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Service",
        name: isEs ? "Diseño Web Premium" : "Premium Web Design",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: ["ES", "GB", "US"],
        description: isEs
          ? "Webs nivel Awwwards con IA, agente Claude, GEO y contenido recurrente"
          : "Awwwards-level websites with AI, Claude agent, GEO and recurring content",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable}`}
    >
      <body>
        <a
          href="#main-content"
          className="skip-to-content sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:bg-[#0a0a0a] focus:text-[#c8a96e] focus:px-4 focus:py-2 focus:text-sm"
        >
          {t("skipToContent")}
        </a>
        <JsonLd locale={locale as Locale} />
        <NextIntlClientProvider messages={messages}>
          <Preloader />
          <Cursor />
          <Nav />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
