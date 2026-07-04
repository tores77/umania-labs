import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

/**
 * SERVICE PAGE REGISTRY
 * ---------------------
 * To add a new sector page:
 * 1. Add a entry to `SERVICES` (logical pathname + localized URL paths).
 * 2. Register the logical pathname in `i18n/routing.ts` → `pathnames`.
 * 3. Create `app/[locale]/services/<slug>/page.tsx` (copy `luxury-villas/page.tsx`).
 * 4. Add `servicePages.<key>` copy in `messages/es.json` and `messages/en.json`.
 * 5. Sitemap picks up new entries via `getServiceSitemapEntries()` automatically.
 * 6. Link from `services.sectorLinks` (home) and `footer.serviceLinks` (footer).
 */

export type ServicePathname =
  | "/services/luxury-villas"
  | "/services/fine-dining"
  | "/services/yacht-charter";

export type ServiceMessageKey = "luxuryVillas" | "fineDining" | "yachtCharter";

export type ServiceDefinition = {
  id: string;
  pathname: ServicePathname;
  messageKey: ServiceMessageKey;
  paths: {
    es: string;
    en: string;
  };
  sitemap: {
    changeFrequency: "monthly";
    priority: number;
  };
};

export const SERVICES: ServiceDefinition[] = [
  {
    id: "luxury-villas",
    pathname: "/services/luxury-villas",
    messageKey: "luxuryVillas",
    paths: {
      es: "/servicios/diseno-web-villas-lujo-mallorca",
      en: "/services/luxury-villa-real-estate-web-design",
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.85,
    },
  },
  {
    id: "fine-dining",
    pathname: "/services/fine-dining",
    messageKey: "fineDining",
    paths: {
      es: "/servicios/diseno-web-restaurantes-alta-gama-mallorca",
      en: "/services/fine-dining-restaurant-web-design-mallorca",
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.85,
    },
  },
  {
    id: "yacht-charter",
    pathname: "/services/yacht-charter",
    messageKey: "yachtCharter",
    paths: {
      es: "/servicios/diseno-web-empresas-charter-yates-mallorca",
      en: "/services/yacht-charter-web-design-mallorca",
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.85,
    },
  },
];

export function getServiceByPathname(pathname: ServicePathname) {
  return SERVICES.find((service) => service.pathname === pathname) ?? null;
}

export function buildServiceLanguageAlternates(service: ServiceDefinition) {
  return {
    es: `${SITE_URL}/es${service.paths.es}`,
    en: `${SITE_URL}/en${service.paths.en}`,
    "x-default": `${SITE_URL}/es${service.paths.es}`,
  };
}

export function getServiceCanonicalUrl(service: ServiceDefinition, locale: Locale) {
  return `${SITE_URL}/${locale}${service.paths[locale]}`;
}

export function getServiceSitemapEntries() {
  return SERVICES.flatMap((service) =>
    (["es", "en"] as const).map((locale) => ({
      service,
      locale,
      url: getServiceCanonicalUrl(service, locale),
      alternates: buildServiceLanguageAlternates(service),
      changeFrequency: service.sitemap.changeFrequency,
      priority: service.sitemap.priority,
    })),
  );
}
