import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
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
        "@type": "WebSite",
        name: "Umania Labs",
        url: `${SITE_URL}/${locale}`,
        inLanguage: locale,
      },
      {
        "@type": "Service",
        name: isEs ? "Diseño Web Premium" : "Premium Web Design",
        provider: { "@type": "Organization", name: "Umania Labs" },
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

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable}`}
    >
      <body>
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
